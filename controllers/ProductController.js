import { Sequelize } from "sequelize";
import db from "../models/index.js";
import InsertProductRequest from "../dtos/requests/InsertProductRequest.js";

export async function getProduct(req, res) {
  res.status(200).json({
    message: "Lấy danh sách sản phẩm thành công",
  });
}
export async function getProductById(req, res) {
  res.status(200).json({
    message: "Lấy thông tin sản phẩm thành công",
  });
}

export async function insertProduct(req, res) {
  

  // console.log(JSON.stringify(req.body))
  const product = await db.Product.create(req.body);
  return res.status(201).json({
    message: 'Thêm mới sản phẩm thành công',
    data: product
  });
}

// export async function insertProduct(req, res) {
//   const { error } = InsertProductRequest.validate(req.body);
//   if(error) {
//     return res.status(400).json({
//       message: 'Thêm sản phẩm mới thất bại',
//       error: error.details[0]?.message
//     });
//   }
//   try {
//     const product = await db.Product.create(req.body);
//     return res.status(201).json({
//       message: "Thêm sản phẩm thành công", 
//       data: product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Lỗi khi thêm sản phẩm",
//       error,
//     });
//   }
// }
export async function deleteProduct(req, res) {
  res.status(200).json({
    message: "Xóa sản phẩm thành công",
  });
}
export async function updateProduct(req, res) {
  res.status(200).json({
    message: "Cập nhật sản phẩm thành công",
  });
}
