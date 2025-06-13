import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest.js";
import ResponseUser from "../dtos/responses/user/ResponseUser.js";
import argon2 from 'argon2'
// Lấy danh sách người dùng (có tìm kiếm, phân trang)

// Thêm người dùng
export async function insertUser(req, res) {
  const existingUser = await db.User.findOne({
    where: { email: req.body.email },
  });
  if (existingUser) {
    return res.status(409).json({
      message: "Email đã tồn tại",
      
    });
  }
  const hassedPassword = await argon2.hash("password");
  const user = await db.User.create({
    ...req.body,
    password: hassedPassword,
  });

  if (user) {
    return res.status(201).json({
      message: "Thêm mới người dùng thành công",
      data: new ResponseUser(user), // trả về user không có password
    });
  } else {
    return res.status(400).json({
      message: "Không thể thêm người dùng",
    });
  }
}

// Cập nhật người dùng
export async function updateUser(req, res) {
  const { id } = req.params;

  const updatedUser = await db.User.update(req.body, {
    where: { id },
  });

  if (updatedUser[0] > 0) {
    return res.status(200).json({
      message: "Cập nhật người dùng thành công",
    });
  }

  return res.status(404).json({
    message: "Người dùng không tìm thấy",
  });
}

// Xoá người dùng
export async function deleteUser(req, res) {
  const { id } = req.params;

  const deleted = await db.User.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa người dùng thành công",
    });
  }

  return res.status(404).json({
    message: "Người dùng không tìm thấy",
  });
}
