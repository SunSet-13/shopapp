## 1. Cấu trúc dự án

```shell
src 


```

## 2. Cài đặt Sequelize và migrate các bảng User, News, Category, Brand (04)

1. Thư viện cần cài
``` javascript
    yarn add mysql2
    yarn add sequelize
    yarn add sequelize-cli
    npx sequelize-cli init

```
2. Tạo bảng
- Tạo models cùng migrations
```javascript
    npx sequelize-cli model:generate --name User --attributes email:string,password:string,name:string,role:integer,avatar:string,phone:integer,created_at:date,updated_at:date

    npx sequelize-cli db:migrate
    //xóa bảng vừa tạo
    npx sequelize-cli db:migrate:undo
    //xóa tất cả
    npx sequelize-cli db:migrate:undo:all 

```
## 3. Tạo bảng với khóa chính khóa ngoại (05)
    - Bổ sung khóa ngoại vào 'static associate(models)' trong các models liên quuan và 'async up(queryInterface, Sequelize) {
    await queryInterface.createTable' trong migration
    - bên 1 thì có hasMany bên nhiều có belongTo

## 4. Cài đặt express, nodemon, dotenv, babel (06)
1. Thư viện cần cài 
```javascript
    yarn add express
    yarn add dotenv nodemon
    yarn add --dev @babel/core @babel/node @babel/preset-env

```
2.Tạo thêm thư mục .babelrc và .env
     - config babel
 ```javascript
     "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
```

## 5. Tùy biến route ProductController (07)
server->AppRoute->controller
- Trong file server cần import
```javascript
    import express from 'express';
    import dotenv from 'dotenv';
    dotenv.config();
    const app = express();
    app.use(express.json());  //thêm middleware để parse JSON request body
    app.use(express.urlencoded({ extended: true }));//thêm middleware để parse URL-encoded request body

    import { AppRoute } from './AppRoute.js'; 
```


- Trong file AppRoute 

```javascript
    import express from 'express';
    const router = express.Router();
    import * as ProductController from './controllers/ProductController.js';
    export function AppRoute(app)

```
## 6. Viết request thêm mới Product và debug (09)
- Chú ý phải thêm dữ liệu vào các bảng lá trước nếu không sẽ lỗi
```javascript
export async function insertProduct(req, res) {
  try {
    // console.log(JSON.stringify(req.body));
    const product = await db.Product.create(req.body);
    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      data : product,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Lỗi khi thêm sản phẩm",
      error: error.message
    });
  }
}

```
## 7. Validate các đối tượng request gửi lên Controller (10)
1. Thư viện cần cài 
```javascript
    yarn add joi

```
2.Tạo thêm thư mục 
     - Tạo thêm thư mục dtos, trong đó có 2 thư mục requests và responses 
     - Trong requests tạo file InsertProductRequest.js
 ```javascript
     "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
```
## 8. Xử lí middlewares (11,12)
1. Tạo thêm thư mục
- Tạo thêm thư mục middlewares chứa file asyncHandler.js
  File đó có chức năng xử lý lỗi thay cho Controller
  trong routes, bọc try catch của asyncHandler vào controller
  ví dụ
  ```javascript
  export function routes(app) {

 
  router.post("/products", asyncHandler(ProductController.insertProduct)); // Sửa dòng này
    }
  
  ```
  - Tạo thêm file validate trong middlewares
   dùng để xác thực dữ liệu đầu vào, nếu không đúng trả về lỗi 400
   ```javascript
   const validate = (requestType) => {
  return (req, res, next) => {
    const { error } = requestType.validate(req.body); // Validate the request body against the schema
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0]?.message, // Return the first validation error message
      });
    }
    next(); // If validation passes, proceed to the next middleware or route handler
  };
  };
  export default validate;
  ```
  ## 9.Xây Dựng Chức Năng Tìm Kiếm và Phân Trang cho Product, Category, Brand (13)
  - Sử dụng Op của Sequelize
  - Ví dụ 1 hàm xử lí phân trang và tìm kiếm 
  ```javascript
  const {Op} = Sequelize;
  export async function getProduct(req, res) {
  //const products = await db.Product.findAll()
  const {search = '',page =1} = req.query;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;//5, trang 2 bắt đầu từ sp số 6
  let whereClause = {};
    if(search.trim() !== '') {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { specification: { [Op.like]: `%${search}%` } }
        ]
      }
    }
  const [products, totalProducts] = await Promise.all([
    db.Product.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset
    }),
    db.Product.count({
      where: whereClause
    })
  ]);
  res.status(200).json({
    message: "Lấy danh sách sản phẩm thành công",
    data: products,
    currentPage: parseInt(page,10),
    totalPages: Math.ceil(totalProducts / pageSize),//11sp = 3 trang
    totalProducts
  });
  }
  ```

## 10. Viết các phương thức Update, Delete cho Product, Order (15)
- Xử lí trong ProductController.
-  Update phải đúng định dạng, xử lí trong UpdateProductRequest
-  Bọc hàm kiểm tra dữ liệu trong routes 
```javascript
  router.delete("/products/:id", asyncHandler(ProductController.deleteProduct));
  router.put("/products/:id", 
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updateProduct));
```
## 11.Viết chức năng thêm mới User và Order, mã hoá mật khẩu với argon2 (016)
- Làm tương tự như với Product
- thêm file Response.js trong thư mục response 
- Với User cần mã hóa mật khẩu trong UserController
1. Thư viện cần tải
```javascript
  yarn add argon2
```
2.
- Thêm xử lý mã hóa mật khẩu trong hàm insertUser trong file UserController
```javascript
 const hassedPassword = await argon2.hash("password");
  const user = await db.User.create({
    ...req.body,
    password: hassedPassword,
  });

```
- Lưu ý: 
  Kiểm tra user có tồn tại không trong phần oder
  Kiểm tra email có tồn tại không trong phần user
## 12.Thêm mới các News và xử lý transactions khi insert nhiều bảng(017)
- Xử lí trong NewsController, hàm insert, xử lí 1 news có nhiều id sản phẩm
## 13.Các chức năng CRUD cho NewsDetail(018)
- Làm tương tự như các bảng khác
- Thêm phần join bảng khi xử lí trong controller
```javascript
 db.NewsDetail.findAll({
      limit: pageSize,
      offset: offset,
      in ra tt chi tiết tương đương join bảng trong sql
      include: [
      { model: db.News },
      { model: db.Product },
      ],
    }),
```
- Khi insert, update phải kiểm tra xem product_id và news_id có tồn tại không vì nó có liên quan đến 2 bảng news và product
## 14.Các request update và delete News(019)
- Khi xóa ở bên news thì bên news_detail cũng phải xóa.
- Quan hệ giữa news và news_detail là 1 nhiều.
- Sử dụng transaction để rollback lại từ đầu nếu có 1 lệnh nào đó không thành công
## 15. Đưa các thông số DB và biến môi trường, sử dụng HealthCheck (020)
- sửa file .env và index.js trong models sao cho phù hợp
- dùng heathcheck để kiểm tra tình trạng hoạt động của server, hệ thống
## 16. Tạo các Request cho Thực Thể Banner và BannerDetail trong NodeJS (021)
- làm giống như News và NewsDetail
- Chú ý:
  + Khi thêm và sửa BannerDetail phải kiểm tra banner_id và product_id có tồn tại không
  + Khi sửa phải kiểm tra BannerDetail đó có tồn tại hay chưa (trừ bản thân chính nó)
## 17. Upload nhiều ảnh với multer, ImageController (022)
1. Thư viện cần tải
```javascript
  yarn add multer
```
2. Tạo thêm thư mục middlewares
- Thêm phần middlewares upload trong file server.js
- Xử lí lỗi trong file UploadImagesMiddleware.js

