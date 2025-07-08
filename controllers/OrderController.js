import { Sequelize } from "sequelize";
import db from "../models/index";
const { Op } = Sequelize;

export async function getOrder(req, res) {
  res.status(200).json({
    message: "Lấy danh sách đơn hàng thành công",
  });
}
export async function getOrderById(req, res) {
  const { id } = req.params;

  const order = await db.Order.findByPk(id, {
    include: [
      {
        model: db.OrderDetail,
        as: "order_details",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
    ],
  });

  if (!order) {
    return res.status(404).json({
      message: "Không tìm thấy đơn hàng",
    });
  }

  return res.status(200).json({
    message: "Lấy thông tin đơn hàng thành công",
    data: order,
  });
}

export async function insertOrder(req, res) {
  const { user_id } = req.body;

  // Kiểm tra user có tồn tại không
  const user = await db.User.findByPk(user_id);
  if (!user) {
    return res.status(404).json({
      message: "Người dùng không tồn tại",
      
    });
  }
  const order = await db.Order.create(req.body);
  if(order){
  return res.status(201).json({
    message: "Thêm đơn hàng thành công",
    data: order,
  });
}
else {
  res.status(400).json({
    message: "Thêm đơn hàng Không thành công"
  })
}
}

export async function deleteOrder(req, res) {
  const { id } = req.params;

  const deleted = await db.Order.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa đơn hàng thành công",
    });
  }

  return res.status(404).json({
    message: "Đơn hàng không tìm thấy",
  });
}

export async function updateOrder(req, res) {
  const { id } = req.params;

  const updatedOrder = await db.Order.update(req.body, {
    where: { id },
  });

  if (updatedOrder[0] > 0) {
    return res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
    });
  }

  return res.status(404).json({
    message: "Đơn hàng không tìm thấy",
  });
}
