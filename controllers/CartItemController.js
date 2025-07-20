
import { Sequelize } from "sequelize";
import db from "../models/index";
import e from "express";
const { Op } = Sequelize;
import { getAvatarURL } from "../helpers/imageHelper.js";

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
        },
      ],
    }),
    db.CartItem.count({ where: whereClause }),
  ]);

  res.status(200).json({
    message: "Lấy danh sách mục trong giỏ hàng thành công",
    data: cartItems,
    current_page: parseInt(page, 10),
    total_page: Math.ceil(totalCartItems / pageSize),
    total: totalCartItems,
  });
};

export const getCartItemById = async (req, res) => {
  const { id } = req.params;

  const cartItem = await db.CartItem.findByPk(id, {
    include: [
      {
        model: db.Product,
        as: "product",
      },
    ],
  });

  if (!cartItem) {
    return res.status(404).json({
      message: "Mục trong giỏ không tìm thấy",
    });
  }

  res.status(200).json({
    message: "Lấy thông tin mục trong giỏ hàng thành công",
    data: cartItem,
  });
};

// Lấy một mục trong giỏ hàng theo id
export const getCartItemsByCartId = async (req, res) => {
  const { cart_id } = req.params;

  const cartItems = await db.CartItem.findAll({
    where: { cart_id },
    include: [
      {
        model: db.Product,
        as: "product",
      },
    ],
  });

  if (!cartItems || cartItems.length === 0) {
    return res.status(404).json({
      message: "Không tìm thấy mục nào trong giỏ hàng",
    });
  }

  res.status(200).json({
    message: "Lấy danh sách mục trong giỏ hàng thành công",
    data: cartItems,
  });
};

export const insertCartItem = async (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  // Kiểm tra sản phẩm có tồn tại không
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }

  //  Kiểm tra số lượng yêu cầu không vượt quá số lượng trong kho
  if (quantity > product.quantity) {
    return res.status(400).json({
      message: `Số lượng yêu cầu (${quantity}) vượt quá số lượng còn lại trong kho (${product.quantity})`
    });
  }

  // Kiểm tra giỏ hàng có tồn tại không
  const cart = await db.Cart.findByPk(cart_id);
  if (!cart) {
    return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
  }

  // Tìm mục giỏ hàng có sẵn
  const existingCartItem = await db.CartItem.findOne({
    where: { cart_id, product_id }
  });

  if (existingCartItem) {
    if (quantity === 0) {
      // Nếu số lượng bằng 0 → xóa mục này
      await existingCartItem.destroy();
      return res.status(200).json({
        message: "Mục trong giỏ hàng đã được xóa"
      });
    } else {
      // Nếu số lượng khác 0 → cập nhật lại số lượng
      // Tổng mới không được vượt quá tồn kho
      if (quantity > product.quantity) {
        return res.status(400).json({
          message: `Không thể cập nhật số lượng vượt quá tồn kho (${product.quantity})`
        });
      }

      existingCartItem.quantity = quantity;
      await existingCartItem.save();
      return res.status(200).json({
        message: "Cập nhật số lượng mục trong giỏ hàng thành công",
        data: existingCartItem
      });
    }
  } else {
    // Nếu mục chưa tồn tại và quantity > 0 → thêm mới
    if (quantity > 0) {
      const newCartItem = await db.CartItem.create({ cart_id, product_id, quantity });
      return res.status(201).json({
        message: "Thêm mới mục trong giỏ hàng thành công",
        data: newCartItem
      });
    } else {
      return res.status(400).json({
        message: "Không thể thêm mục vào giỏ với số lượng bằng 0"
      });
    }
  }
};

export const insertIncreaseCartItem = async (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  // Kiểm tra sản phẩm có tồn tại không
  const productExists = await db.Product.findByPk(product_id);
  if (!productExists) {
    return res.status(404).json({
      message: 'Sản phẩm không tồn tại'
    });
  }

  // Kiểm tra giỏ hàng có tồn tại không
  const cartExists = await db.Cart.findByPk(cart_id);
  if (!cartExists) {
    return res.status(404).json({
      message: 'Giỏ hàng không tồn tại'
    });
  }

  // Kiểm tra xem CartItem đã tồn tại chưa
  const existingCartItem = await db.CartItem.findOne({
    where: { cart_id, product_id }
  });

  // Nếu đã tồn tại
  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;

    // Nếu tổng quantity bằng 0 → xóa
    if (newQuantity <= 0) {
      await existingCartItem.destroy();
      return res.status(200).json({
        message: "Đã xóa mục trong giỏ hàng vì số lượng bằng 0"
      });
    }

    // Ngược lại → cập nhật số lượng
    existingCartItem.quantity = newQuantity;
    await existingCartItem.save();

    return res.status(200).json({
      message: "Cập nhật số lượng sản phẩm trong giỏ hàng thành công",
      data: existingCartItem
    });
  }

  // Nếu chưa có CartItem → tạo mới (nếu quantity > 0)
  if (quantity > 0) {
    const newCartItem = await db.CartItem.create({ cart_id, product_id, quantity });

    return res.status(201).json({
      message: "Thêm mới mục trong giỏ hàng thành công",
      data: newCartItem
    });
  } else {
    return res.status(400).json({
      message: "Số lượng phải lớn hơn 0 khi thêm mới sản phẩm vào giỏ hàng"
    });
  }
};


export const insertDecreaseCartItem = async (req, res) => {
  const { cart_id, product_id, quantity } = req.body;

  // Kiểm tra sản phẩm có tồn tại không
  const productExists = await db.Product.findByPk(product_id);
  if (!productExists) {
    return res.status(404).json({
      message: 'Sản phẩm không tồn tại'
    });
  }

  // Kiểm tra giỏ hàng có tồn tại không
  const cartExists = await db.Cart.findByPk(cart_id);
  if (!cartExists) {
    return res.status(404).json({
      message: 'Giỏ hàng không tồn tại'
    });
  }

  // Kiểm tra xem CartItem đã tồn tại chưa
  const existingCartItem = await db.CartItem.findOne({
    where: { cart_id, product_id }
  });

  // Nếu đã tồn tại
  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity - quantity;

    // Nếu tổng quantity bằng 0 → xóa
    if (newQuantity <= 0) {
      await existingCartItem.destroy();
      return res.status(200).json({
        message: "Đã xóa mục trong giỏ hàng vì số lượng bằng 0"
      });
    }

    // Ngược lại → cập nhật số lượng
    existingCartItem.quantity = newQuantity;
    await existingCartItem.save();

    return res.status(200).json({
      message: "Cập nhật số lượng sản phẩm trong giỏ hàng thành công",
      data: existingCartItem
    });
  }

  // Nếu chưa có CartItem → tạo mới (nếu quantity > 0)
  if (quantity > 0) {
    const newCartItem = await db.CartItem.create({ cart_id, product_id, quantity });

    return res.status(201).json({
      message: "Thêm mới mục trong giỏ hàng thành công",
      data: newCartItem
    });
  } else {
    return res.status(400).json({
      message: "Số lượng phải lớn hơn 0 khi thêm mới sản phẩm vào giỏ hàng"
    });
  }
};




// Cập nhật số lượng mục trong giỏ
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cartItem = await db.CartItem.findByPk(id);
  if (!cartItem) {
    return res.status(404).json({
      message: "Mục trong giỏ hàng không tìm thấy",
    });
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  res.status(200).json({
    message: "Cập nhật mục trong giỏ hàng thành công",
    data: cartItem,
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
      message: "Xóa mục trong giỏ hàng thành công",
    });
  } else {
    return res.status(404).json({
      message: "Mục trong giỏ hàng không tìm thấy",
    });
  }
};
