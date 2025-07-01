import { Sequelize } from "sequelize";
import db from "../models/index.js";
const { Op } = Sequelize;

// Lấy danh sách hình ảnh sản phẩm (có phân trang và lọc theo product_id)
export async function getProductImages(req, res) {
  const { product_id = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (product_id !== "") {
    whereClause.product_id = product_id;
  }
 

// join sang bảng Product để lấy thông tin sản phẩm
  const [productImages, totalProductImages] = await Promise.all([
    db.ProductImage.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      order: [["id", "DESC"]],
      // include: [
      //   {
      //     model: db.Product,
      //     as: "Product",
      //   },
      // ], // Thêm include nếu cần lấy thông tin sản phẩm
    }),
    db.ProductImage.count({
      where: whereClause,
    }),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách hình ảnh sản phẩm thành công",
    data: productImages,
    currentPage: parseInt(page),
    totalPage: Math.ceil(totalProductImages / pageSize),
    totalProductImages,
  });
}



// Lấy hình ảnh theo ID
export async function getProductImageById(req, res) {
  const { id } = req.params;
  const productImage = await db.ProductImage.findByPk(id);

  if (!productImage) {
    return res.status(404).json({
      message: "Hình ảnh không tồn tại",
    });
  }

  return res.status(200).json({
    message: "Lấy thông tin hình ảnh sản phẩm thành công",
    data: productImage,
  });
}

export async function insertProductImage(req, res) {
  const { product_id, image_url } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!product_id || !image_url) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ product_id và image_url",
    });
  }

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({
      message: "Sản phẩm không tồn tại",
    });
  }

  // Kiểm tra trùng ảnh (cặp product_id + image_url)
  const existingImage = await db.ProductImage.findOne({
    where: { product_id, image_url },
  });

  if (existingImage) {
    return res.status(400).json({
      message: "Hình ảnh này đã tồn tại cho sản phẩm",
    });
  }

  // Thêm mới ảnh sản phẩm
  const productImage = await db.ProductImage.create({ product_id, image_url });

  return res.status(201).json({
    message: "Thêm hình ảnh thành công",
    data: productImage,
  });
}


// Cập nhật hình ảnh
export async function updateProductImage(req, res) {
  const { id } = req.params;
  const { product_id, image_url } = req.body;

  if (product_id !== undefined && image_url !== undefined) {
    const existing = await db.ProductImage.findOne({
      where: {
        product_id,
        image_url,
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Hình ảnh đã tồn tại cho sản phẩm này",
      });
    }
  }

  const updated = await db.ProductImage.update(req.body, {
    where: { id },
  });

  if (updated[0] > 0) {
    return res.status(200).json({
      message: "Cập nhật hình ảnh thành công",
    });
  }

  return res.status(404).json({
    message: "Không tìm thấy hình ảnh để cập nhật",
  });
}

// Xóa hình ảnh theo ID
export async function deleteProductImage(req, res) {
  const { id } = req.params;

  const deleted = await db.ProductImage.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa hình ảnh thành công",
    });
  }

  return res.status(404).json({
    message: "Hình ảnh không tìm thấy",
  });
}
