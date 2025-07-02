import db from "../models";

// Lấy danh sách giỏ hàng theo user_id (có thể dùng cho admin hoặc user)
export const getCart = async (req, res) => {
  const { user_id } = req.query;

  const cart = await db.Cart.findOne({
    where: { user_id },
    include: [
      {
        model: db.CartItem,
        as: "cartItems",
        include: [
          {
            model: db.Product,
            as: "product"
          }
        ]
      }
    ]
  });

  if (!cart) {
    return res.status(404).json({
      message: "Không tìm thấy giỏ hàng"
    });
  }

  res.status(200).json({
    message: "Lấy giỏ hàng thành công",
    data: cart
  });
};

// Lấy giỏ hàng theo id (primary key)
export const getCartById = async (req, res) => {
  const { id } = req.params;

  const cart = await db.Cart.findByPk(id, {
    include: [
      {
        model: db.CartItem,
        as: "cartItems",
        include: [
          {
            model: db.Product,
            as: "product"
          }
        ]
      }
    ]
  });

  if (!cart) {
    return res.status(404).json({
      message: "Giỏ hàng không tìm thấy"
    });
  }

  return res.status(200).json({
    message: "Lấy thông tin giỏ hàng thành công",
    data: cart
  });
};

// Tạo giỏ hàng mới
export const insertCart = async (req, res) => {
  const { user_id } = req.body;

  const existingCart = await db.Cart.findOne({ where: { user_id } });
  if (existingCart) {
    return res.status(400).json({ message: "Giỏ hàng đã tồn tại" });
  }

  const cart = await db.Cart.create({ user_id });

  res.status(201).json({
    message: "Tạo giỏ hàng thành công",
    data: cart
  });
};

// Xóa giỏ hàng theo id
export const deleteCart = async (req, res) => {
  const { id } = req.params;

  const deleted = await db.Cart.destroy({ where: { id } });

  if (!deleted) {
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  }

  res.status(200).json({ message: "Xóa giỏ hàng thành công" });
};
