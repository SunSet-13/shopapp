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

## 18.Update ảnh sau khi upload, thêm middlware kiểm tra ảnh (023)
- thư viện sử dụng: fs, path
- Xử lí trong ImageController
- Xử lí trong UploadImagesMiddleware.js
- Thêm phần validateImageExists trong middlewares để kiểm tra những ảnh up load (tách ra 1 file riêng để tái sử dụng, do nhiều file cùng có 1 hàm để kiểm tra ảnh upload)
- thêm validateImageExists bọc vào trong từng route mà có ảnh upload, update

## 19. Upload ảnh lên Google Firebase Storage (024)
- Xử lí trong ImageController
- Xử lí trong UploadImagesMiddleware.js
- Thêm phần validateImageExists trong middlewares để kiểm tra những ảnh up load (tách ra 1 file riêng để tái sử dụng, do nhiều file cùng có 1 hàm để kiểm tra ảnh upload)
- thêm validateImageExists bọc vào trong từng route mà có ảnh upload, update

## 25. Viết request xoá các ảnh trên Google Cloud và Local server
- Xử lí trong ImageController
- Xử lí trong UploadImagesMiddleware.js
- Lưu ý khi xóa ảnh phải kiểm tra xem ảnh có đang được sử dụng hay không
- Kiểm tra trong các db liên quan đến ảnh
- Xóa ảnh từ Firebase Storage
- Xóa ảnh từ local server

## 26. Thêm dữ liệu vào bảng Product và ProductImage(27)
- Thêm xử lí trong ProductController
- Thêm join bảng 
```javascript
  const product = await db.Product.findByPk(id, {
      include: [{
        model: db.ProductImage,
        as: 'productImages', // dùng đúng alias đã khai báo trong Product.hasMany
      }],
    });
```
## 27. Thêm các bảng quản lý giỏ hàng và các controller tương ứng(28)
- Thêm 2 bảng, tạo tương tự như các bảng khác.
- Làm tương tự Category, xử lí validate cho từng bảng
- Sử dụng sequelize tìm giỏ hàng của người dùng và lấy kèm theo toàn bộ sản phẩm trong giỏ, có giải thích chi tiết như sau:
```javascript
  const cart = await db.Cart.findOne({
     where: { user_id },
     include: [
        {
          model: db.CartItem,
          as: "cartItems",
          include: [
           {
              model: db.Product,
              as: "product"
           }
         ]
       }
     ]
   });
```
## 28. Viết api đặt hàng, chuyển dữ liệu từ Cart sang Order (029)
- Trong CartController:
  + cho phép mua hàng ko cần đăng nhập
  + nếu session_id = null và user_id = null thì đó là khách vãng lai và ngược lại với khách có đăng nhập 
- Trong CartItemController
  + Khi insert sản phẩm vào giỏ hàng, nếu sản phẩm đó đã có thì cập nhật luôn số lượng sản phẩm ngay trong hàm insert, nếu ko có thì tạo mới, nếu số lượng sản phẩm = 0 thì xóa sản phẩm đó khỏi giỏ hàng
  + Kiểm tra số lượng sản phẩm cho vào giỏ có lớn hơn trong kho hay không
  + Khi xóa sản phẩm ở cartitem thì bên cart cũng phải được xóa
- Xử lí checkout trong CartController, đẩy sang Order
  + Chuyển đơn hàng từ cart sang order, thành công thì phải xóa trong cart đi, tương tự cart_items cũng bị xóa
  ```javascript
    include: [
    {
      model: db.Product,
     as: 'product'
    }
  ]
  ```
- "as:product" giúp đặt tên rõ ràng cho quan hệ khi truy vấn liên kết giữa các bảng phải dùng đúng tên này.
## 29. Đặt enum cho các status (030)
- Thêm folder contants, thêm enum status cho Banner và Order, dùng file index trong contants để gọi chung cho tất cả status của các bảng
## 30. Viết các request đăng nhập đăng ký người dùng (031)
- chỉnh sửa file UserController
  + Cho phép đăng ký với gmail hoặc số điện thoại, đăng nhập cũng tương tự
  + nhớ hash mật khẩu ( có thể dùng argon)
## 31. Phân quyền cho từng Request với JWT middleware(032)
- Dùng jwt 
## 32. Viết api cập nhật thông tin User, đổi Password(033)
## 33. Sửa lại các đối tượng response hiển thị ảnh(034)