import { Sequelize } from "sequelize";
import db from "../models/index";
const { Op } = Sequelize;
import fs from "fs";
import path from "path";

// Lấy danh sách banner có tìm kiếm và phân trang
export async function getBannerList(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      name: { [Op.like]: `%${search}%` },
    };
  }

  const [bannerList, totalBanners] = await Promise.all([
    db.Banner.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.Banner.count({
      where: whereClause,
    }),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách banner thành công",
    data: bannerList,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(totalBanners / pageSize),
    totalBanners,
  });
}

// Lấy banner theo ID
export async function getBannerById(req, res) {
  const { id } = req.params;
  const banner = await db.Banner.findByPk(id);
  if (!banner) {
    return res.status(404).json({
      message: "Banner không tìm thấy",
    });
  }
  return res.status(200).json({
    message: "Lấy thông tin banner thành công",
    data: banner,
  });
}

// Thêm banner mới
export async function insertBanner(req, res) {
  const { name } = req.body;

  try {
    // Kiểm tra tên banner đã tồn tại chưa
    const existingBanner = await db.Banner.findOne({
      where: { name: name.trim() },
    });

    if (existingBanner) {
      return res.status(400).json({
        message: "Banner với tên này đã tồn tại",
      });
    }

    // Tạo mới nếu không trùng
    const banner = await db.Banner.create(req.body);

    return res.status(201).json({
      message: "Thêm banner thành công",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra khi thêm banner",
      error: error.message,
    });
  }
}

// Cập nhật banner
export async function updateBanner(req, res) {
  const { id } = req.params;

  // Check for duplicate name before update
  const existingBanner = await db.Banner.findOne({
    where: {
      name: req.body.name,
      id: { [Op.ne]: id },
    },
  });

  if (existingBanner) {
    return res.status(400).json({
      message: "Tên banner đã tồn tại, vui lòng chọn tên khác.",
    });
  }

  // Update the banner
  const updated = await db.Banner.update(req.body, {
    where: { id },
  });

  // If update failed (no rows affected), return 404
  if (updated[0] === 0) {
    return res.status(404).json({
      message: `Không tìm thấy banner với id = ${id} hoặc dữ liệu không thay đổi.`,
    });
  }

  // Success
  return res.status(200).json({
    message: "Cập nhật banner thành công",
  });
}

// Xoá banner
export async function deleteBanner(req, res) {
  const { id } = req.params;
  try {
    const deleted = await db.Banner.destroy({
      where: { id },
    });

    if (deleted) {
      return res.status(200).json({
        message: "Xóa banner thành công",
      });
    } else {
      return res.status(404).json({
        message: "Banner không tìm thấy",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa banner",
      error: error.message,
    });
  }
}
