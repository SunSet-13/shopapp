
import { Sequelize } from "sequelize";
import db from "../models/index";
export async function getBrand(req, res) {
    res.status(200).json({
        message: 'Lấy danh sách thương hiệu thành công',
    });
}

export async function getBrandById(req, res) {
    res.status(200).json({
        message: 'Lấy thông tin thương hiệu thành công',
    });
}

export async function insertBrand(req, res) {
  try {
    // Thêm brand mới với dữ liệu từ req.body
    const brand = await db.Brand.create(req.body);
    res.status(201).json({
      message: "Thêm thương hiệu thành công",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm thương hiệu",
      error: error.message,
    });
  }
}


export async function deleteBrand(req, res) {
    res.status(200).json({
        message: 'Xóa thương hiệu thành công',
    });
}

export async function updateBrand(req, res) {
    res.status(200).json({
        message: 'Cập nhật thương hiệu thành công',
    });
}
