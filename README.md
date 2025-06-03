## Cấu trúc dự án

```shell
src 


```

## Cài đặt Sequelize và migrate các bảng User, News, Category, Brand (04)

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




