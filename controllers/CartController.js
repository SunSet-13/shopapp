import db from "../models";
import { Sequelize } from "sequelize";
import { OrderStatus } from "../constants";
import { getAvatarURL } from "../helpers/imageHelper.js";
const { Op } = Sequelize;

// Lấy danh sách giỏ hàng (dành cho admin) có phân trang và lọc theo session_id hoặc user_id
export const getCarts = async (req, res) => {
  const { session_id, user_id, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};

  if (session_id) whereClause.session_id = session_id;
  if (user_id) whereClause.user_id = user_id;

  console.log("Đang lọc với:", whereClause);

  const [carts, totalCarts] = await Promise.all([
    db.Cart.findAll({
      where: whereClause,
      include: [
        {
          model: db.CartItem,
          as: "cart_items",
        },
      ],
      limit: pageSize,
      offset: offset,
    }),
    db.Cart.count({ where: whereClause }),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách giỏ hàng thành công",
    data: carts,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(totalCarts / pageSize),
    totalCarts,
  });
};

// Lấy giỏ hàng theo user_id (dành cho user đang đăng nhập)
export const getCartBy = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Thiếu user_id" });
  }

  const cart = await db.Cart.findOne({
    where: { user_id },
    include: [
      {
        model: db.CartItem,
        as: "cart_items",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
    ],
  });

  if (!cart) {
    return res.status(404).json({
      message: "Không tìm thấy giỏ hàng",
    });
  }

  res.status(200).json({
    message: "Lấy giỏ hàng thành công",
    data: cart,
  });
};

// Lấy giỏ hàng theo id
export const getCartById = async (req, res) => {
  const { id } = req.params;

  const cart = await db.Cart.findByPk(id, {
    include: [
      {
        model: db.CartItem,
        as: "cart_items",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
    ],
  });

  if (!cart) {
    return res.status(404).json({
      message: "Giỏ hàng không tìm thấy",
    });
  }

  return res.status(200).json({
    message: "Lấy thông tin giỏ hàng thành công",
    data: cart,
  });
};
// cho phép mua hàng ko cần đăng nhập
//nếu session_id = null và user_id = null thì đó là khách vãng lai và ngược lại với khách có đăng nhập
export const insertCart = async (req, res) => {
  const { user_id, session_id } = req.body;

  // 1. Kiểm tra logic
  if ((!user_id && !session_id) || (user_id && session_id)) {
    return res.status(400).json({
      message: "Phải có duy nhất 1 trong 2: user_id hoặc session_id",
    });
  }

  //  2. Kiểm tra nếu session_id được gửi → phải là duy nhất
  if (session_id) {
    const existingSessionCart = await db.Cart.findOne({
      where: { session_id },
    });
    if (existingSessionCart) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng với session_id này đã tồn tại" });
    }
  }

  //  3. Kiểm tra nếu user_id được gửi → cũng phải duy nhất
  if (user_id) {
    const existingUserCart = await db.Cart.findOne({ where: { user_id } });
    if (existingUserCart) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng của người dùng đã tồn tại" });
    }
  }

  // 4. Tạo giỏ hàng
  const cart = await db.Cart.create({ user_id, session_id });

  return res.status(201).json({
    message: "Tạo giỏ hàng thành công",
    data: cart,
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

export const checkoutCart = async (req, res) => {
  const { cart_id, total, note } = req.body;

  // Bắt đầu transaction
  const transaction = await db.sequelize.transaction();
  try {
    // 1. Kiểm tra cart có tồn tại không
    const cart = await db.Cart.findByPk(cart_id, {
      include: {
        model: db.CartItem,
        as: "cart_items",
        include: {
          model: db.Product,
          as: "product",
        },
      },
      transaction,
    });

    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    if (!cart.cart_items || cart.cart_items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // 2. Tính tổng tiền nếu chưa có
    let finalTotal = total;
    if (finalTotal == null) {
      finalTotal = cart.cart_items.reduce((sum, item) => {
        return sum + item.quantity * item.product.price;
      }, 0);
    }

    // 3. Tạo đơn hàng (Order)
    const order = await db.Order.create(
      {
        user_id: cart.user_id || null,
        session_id: cart.session_id || null,
        total: finalTotal,
        note: note || null,
        status: OrderStatus.PENDING, // Giả sử trạng thái đơn hàng là PENDING
      },
      { transaction }
    );

    // 4. Chuyển cart_items sang order_details
    const orderDetails = cart.cart_items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await db.OrderDetail.bulkCreate(orderDetails, { transaction });

    // 5. Xóa cart_items và cart
    await db.CartItem.destroy({ where: { cart_id }, transaction });
    await db.Cart.destroy({ where: { id: cart_id }, transaction });

    // 6. Commit
    await transaction.commit();
    return res.status(201).json({
      message: "Thanh toán thành công",
      data: order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Checkout error:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi thanh toán",
      error: error.message,
    });
  }
};
