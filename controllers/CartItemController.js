import db from "../models";

// Lấy danh sách mục trong giỏ hàng theo cart_id, có phân trang
export const getCartItems = async (req, res) => {
  const { cart_id, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const whereClause = {};
  if (cart_id) whereClause.cart_id = cart_id;

  const [cartItems, totalCartItems] = await Promise.all([
    db.CartItem.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: db.Product,
          as: "product",
        }
      ]
    }),
    db.CartItem.count({ where: whereClause })
  ]);

  res.status(200).json({
    message: "Lấy danh sách mục trong giỏ hàng thành công",
    data: cartItems,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(totalCartItems / pageSize),
    totalCartItems
  });
};

// Lấy một mục trong giỏ hàng theo id
export const getCartItemById = async (req, res) => {
  const { id } = req.params;

  const cartItem = await db.CartItem.findByPk(id, {
    include: [
      {
        model: db.Product,
        as: 'product',
      }
    ]
  });

  if (!cartItem) {
    return res.status(404).json({
      message: 'Mục trong giỏ không tìm thấy',
    });
  }

  res.status(200).json({
    message: 'Lấy thông tin mục trong giỏ hàng thành công',
    data: cartItem,
  });
};

// Thêm mục mới vào giỏ hàng
export const insertCartItem = async (req, res) => {
  const cartItem = await db.CartItem.create(req.body);

  res.status(201).json({
    message: 'Thêm mới mục trong giỏ hàng thành công',
    data: cartItem,
  });
};

// Cập nhật số lượng mục trong giỏ
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = await db.CartItem.findByPk(id);
  if (!cartItem) {
    return res.status(404).json({
      message: 'Mục trong giỏ hàng không tìm thấy',
    });
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  res.status(200).json({
    message: 'Cập nhật mục trong giỏ hàng thành công',
    data: cartItem
  });
};

// Xóa mục trong giỏ hàng
export const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  const deleted = await db.CartItem.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: 'Xóa mục trong giỏ hàng thành công',
    });
  } else {
    return res.status(404).json({
      message: 'Mục trong giỏ hàng không tìm thấy',
    });
  }
};
