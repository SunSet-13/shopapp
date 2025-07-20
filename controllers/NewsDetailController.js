import { Sequelize } from "sequelize";
import db from "../models/index";
const { Op } = Sequelize;

export async function getNewsDetails(req, res) {
  const { page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const [newsDetails, totalNewsDetails] = await Promise.all([
    db.NewsDetail.findAll({
      limit: pageSize,
      offset: offset,
      //in ra tt chi tiết tương đương join bảng trong sql
      //include: [
      // { model: db.News },
      //{ model: db.Product },
      //],
    }),
    db.NewsDetail.count(),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách chi tiết tin tức thành công",
    data: newsDetails,
    current_page: parseInt(page, 10),
    total_page: Math.ceil(totalNewsDetails / pageSize),
    total: totalNewsDetails,
  });
}

export async function getNewsDetailById(req, res) {
  const { id } = req.params;

  const newsDetail = await db.NewsDetail.findByPk(id, {
    include: [{ model: db.News }, { model: db.Product }],
  });

  if (!newsDetail) {
    return res.status(404).json({
      message: "Chi tiết tin tức không tìm thấy",
    });
  }

  return res.status(200).json({
    message: "Lấy thông tin chi tiết tin tức thành công",
    data: newsDetail,
  });
}

export async function insertNewsDetail(req, res) {
  const { product_id, news_id } = req.body;

  // Kiểm tra product_id có tồn tại không
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(400).json({
      message: `Sản phẩm với  không tồn tại`,
    });
  }

  // Kiểm tra news_id có tồn tại không
  const news = await db.News.findByPk(news_id);
  if (!news) {
    return res.status(400).json({
      message: `Tin tức  không tồn tại`,
    });
  }

  // Kiểm tra nếu cặp product_id + news_id đã tồn tại trong NewsDetail
  const existingDetail = await db.NewsDetail.findOne({
    where: {
      product_id,
      news_id,
    },
  });

  if (existingDetail) {
    return res.status(409).json({
      message: `Chi tiết tin tức với product_id=${product_id} và news_id=${news_id} đã tồn tại`,
    });
  }

  // Thêm bản ghi vào NewsDetail
  const newsDetail = await db.NewsDetail.create({
    product_id,
    news_id,
  });

  return res.status(201).json({
    message: "Thêm mới chi tiết tin tức thành công",
    data: newsDetail,
  });
}


export async function deleteNewsDetail(req, res) {
  const { id } = req.params;

  const deleted = await db.NewsDetail.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa chi tiết tin tức thành công",
    });
  }

  return res.status(404).json({
    message: "Chi tiết tin tức không tìm thấy",
  });
}

export async function updateNewsDetail(req, res) {
  const { id } = req.params;
  const { product_id, news_id } = req.body;

  // Tìm bản ghi hiện tại để cập nhật
  const existingDetail = await db.NewsDetail.findByPk(id);
  if (!existingDetail) {
    return res.status(404).json({
      message: "Chi tiết tin tức không tìm thấy",
    });
  }

  // Kiểm tra trùng lặp với các bản ghi khác
  const duplicate = await db.NewsDetail.findOne({
    where: {
      product_id,
      news_id,
      id: { [db.Sequelize.Op.ne]: id }, // loại trừ chính nó
    },
  });

  if (duplicate) {
    return res.status(409).json({
      message: `Chi tiết tin tức với product_id=${product_id} và news_id=${news_id} đã tồn tại`,
    });
  }

  // Tiến hành cập nhật
  const [updatedCount] = await db.NewsDetail.update(
    { product_id, news_id },
    { where: { id } }
  );

  return res.status(200).json({
    message: "Cập nhật chi tiết tin tức thành công",
  });
}

