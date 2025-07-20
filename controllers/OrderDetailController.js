import { Sequelize } from "sequelize";
import db from "../models/index";
import { Op } from "sequelize";
import { getAvatarURL } from "../helpers/imageHelper.js";




export async function getOrderDetail(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { product_name: { [Op.like]: `%${search}%` } }, // giả sử bạn có cột này
        { note: { [Op.like]: `%${search}%` } },         // hoặc bất kỳ cột nào bạn muốn tìm
      ],
    };
  }

  const [orderDetails, totalOrderDetails] = await Promise.all([
    db.OrderDetail.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.OrderDetail.count({
      where: whereClause,
    }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách chi tiết đơn hàng thành công",
    data: orderDetails,
    current_page: parseInt(page, 10),
    total_page: Math.ceil(totalOrderDetails / pageSize),
    total: totalOrderDetails,
  });
}

export async function getOrderDetailById(req, res) {
  const { id } = req.params;

  const orderDetail = await db.OrderDetail.findByPk(id);

  if (!orderDetail) {
    return res.status(404).json({
      message: "Chi tiết đơn hàng không tồn tại",
    });
  }

  res.status(200).json({
    message: "Lấy thông tin chi tiết đơn hàng thành công",
    data: orderDetail,
  });
}

export async function insertOrderDetail(req, res) {
  const orderDetail = await db.OrderDetail.create(req.body);

  return res.status(201).json({
    message: "Thêm chi tiết đơn hàng thành công",
    data: orderDetail,
  });
}

export async function deleteOrderDetail(req, res) {
  const { id } = req.params;

  const deleted = await db.OrderDetail.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa chi tiết đơn hàng thành công",
    });
  }

  return res.status(404).json({
    message: "Chi tiết đơn hàng không tìm thấy",
  });
}

export async function updateOrderDetail(req, res) {
  const { id } = req.params;

  const updated = await db.OrderDetail.update(req.body, {
    where: { id },
  });

  if (updated[0] > 0) {
    return res.status(200).json({
      message: "Cập nhật chi tiết đơn hàng thành công",
    });
  }

  return res.status(404).json({
    message: "Chi tiết đơn hàng không tìm thấy",
  });
}
