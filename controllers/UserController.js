import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest.js";
import ResponseUser from "../dtos/responses/user/ResponseUser.js";
import argon2 from "argon2";
import UserRole from "../constants/UserRole.js";
import jwt from "jsonwebtoken";
import os  from "os";
import { getAvatarURL } from "../helpers/imageHelper.js";

require("dotenv").config();

// Lấy danh sách người dùng (có tìm kiếm, phân trang)

export async function registerUser(req, res) {
  const { email, phone, password } = req.body;

  // Validate: cần ít nhất email hoặc phone
  if (!email && !phone) {
    return res.status(400).json({
      message: "Cần cung cấp email hoặc số điện thoại",
    });
  }

  // Tạo điều kiện kiểm tra trùng email hoặc phone
  const condition = {};
  if (email) condition.email = email;
  if (phone) condition.phone = phone;

  const existingUser = await db.User.findOne({ where: condition });

  if (existingUser) {
    return res.status(409).json({
      message: "Email hoặc số điện thoại đã tồn tại",
    });
  }

  // Hash mật khẩu nếu có
  const hashedPassword = password ? await argon2.hash(password) : null;

  // Tạo người dùng
  const user = await db.User.create({
    ...req.body, // để thêm các trường khác nếu có
    email,
    phone,
    role: UserRole.USER, // hoặc giá trị mặc định phù hợp
    password: hashedPassword,
    
  });

  // Trả về kết quả
  return res.status(201).json({
    message: "Đăng ký người dùng thành công",
    data: new ResponseUser(user),
  });
}

export async function loginUser(req, res) {
    const { email, phone, password } = req.body;

  // Kiểm tra có email hoặc phone
  if (!email && !phone) {
    return res.status(400).json({
      message: "Vui lòng cung cấp email hoặc số điện thoại",
    });
  }

  // Tìm người dùng theo email hoặc phone
  const condition = {};
  if (email) condition.email = email;
  if (phone) condition.phone = phone;

  const user = await db.User.findOne({ where: condition });

  if (!user) {
    return res.status(401).json({
      message: "Tài khoản không tồn tại",
    });
  }

  // Kiểm tra mật khẩu
  const passwordValid = await argon2.verify(user.password, password);
  if (!passwordValid) {
    return res.status(401).json({
      message: "Mật khẩu không chính xác",
    });
  }
  const token = jwt.sign(
    {id : user.id,
      iat: Math.floor(Date.now()/1000)
    }
    ,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPRITION } // Thời gian hết hạn token
    
  )

  // Đăng nhập thành công
  return res.status(200).json({
    message: "Đăng nhập thành công",
    data: {
      user: new ResponseUser(user), 
      token
    }// trả về user không có password
  });
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const { name, avatar, old_password, new_password } = req.body;

  // Kiểm tra quyền: user không được cập nhật thông tin người khác
  if (req.user.id != id) {
    return res.status(403).json({
      message: 'Không được phép cập nhật thông tin của người dùng khác'
    });
  }

  // Tìm người dùng theo id
  const user = await db.User.findByPk(id);
  if (!user) {
    return res.status(404).json({
      message: 'Người dùng không tìm thấy'
    });
  }

  // Nếu đổi mật khẩu
  if (new_password && old_password) {
    const passwordValid = await argon2.verify(user.password, old_password);
    if (!passwordValid) {
      return res.status(400).json({
        message: 'Mật khẩu cũ không đúng'
      });
    }

    user.password = await argon2.hash(new_password);
  }

  // // Chỉ cập nhật name và avatar nếu có
  // if (name !== undefined) user.name = name;
  // if (avatar !== undefined) user.avatar = avatar;

  // Chỉ cập nhật name và avatar nếu có
if (name !== undefined) user.name = name;
if (avatar !== undefined) {
  user.avatar = getAvatarURL(user.avatar);

  
  }



  // Lưu lại thông tin
  await user.save();

  return res.status(200).json({
    message: 'Cập nhật người dùng thành công',
     data: {
      ...user.get({plain: true}),
      avatar: getAvatarURL(user.avatar) // Chuyển đổi avatar sang URL
    }
  });
};

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
export const getUserById = async (req, res) => {
  const { id } = req.params;

  // Chỉ cho phép người dùng xem thông tin của chính họ hoặc nếu họ có vai trò là admin (role = 2)
  if (req.user.id != id && req.user.role != UserRole.ADMIN) {
    return res.status(403).json({
      message: 'Chỉ người dùng hoặc quản trị viên mới có quyền truy cập thông tin này'
    });
  }

  // Tìm người dùng bằng primaryKey, loại bỏ trường password khỏi kết quả
  const user = await db.User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    return res.status(404).json({
      message: 'Người dùng không tìm thấy'
    });
  }

  res.status(200).json({
    message: 'Lấy thông tin người dùng thành công',
    data: {
      ...user.get({plain: true}),
      avatar: getAvatarURL(user.avatar) // Chuyển đổi avatar sang URL
    }
  });
};
