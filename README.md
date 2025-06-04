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

