import { Sequelize, where } from "sequelize";
import db from "../models/index";
import { OrderStatus } from "../contants";
const { Op } = Sequelize;

export async function getOrder(req, res) {

  const { search = "", page = 1 } = req.query;
  const pageSize = 6;
  const offset = (page - 1) * pageSize; //5, trang 2 bắt đầu từ sp số 6
  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { status: { [Op.like]: `%${search}%` } },
        { note: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  const [orders, totalOrder] = await Promise.all([ 
    db.Order.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset
    }),
    db.Order.count({
      where: whereClause,
    
    })
  ]);
  res.status(200).json({
    message: "Lấy danh sách đơn hàng thành công",
    data: orders,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(totalOrder / pageSize), //11sp = 3 trang
    totalOrder,
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
/*
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
*/


export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  // Cập nhật trạng thái đơn hàng sang FAILED thay vì xóa
  const [updated] = await db.Order.update(
    { status: OrderStatus.FAILED },
    { where: { id } }
  );

  if (updated) {
    return res.status(200).json({
      message: 'Đơn hàng đã được đánh dấu là thất bại 2'
    });
  }

  return res.status(404).json({
    message: 'Đơn hàng không tìm thấy'
  });
};



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
