import { Sequelize } from "sequelize";
import db from "../models/index";
import { getAvatarURL } from "../helpers/imageHelper.js";
const { Op } = Sequelize;

// Lấy danh sách tin tức có tìm kiếm và phân trang
export async function getNewsArticle(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  const [newsList, totalNews] = await Promise.all([
    db.News.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.News.count({
      where: whereClause,
    }),
  ]);

  return res.status(200).json({
  message: "Lấy danh sách tin tức thành công",
  data: newsList.map(news => ({
    ...news.get({ plain: true }),
    image: getAvatarURL(news.image),
  })),
  currentPage: parseInt(page, 10),
  totalPages: Math.ceil(totalNews / pageSize),
  totalNews,
});

}

// Lấy tin tức theo ID
export async function getNewsArticleById(req, res) {
  const { id } = req.params;
  const news = await db.News.findByPk(id);
  if (!news) {
    return res.status(404).json({
      message: "Tin tức không tìm thấy",
    });
  }
 return res.status(200).json({
  message: "Lấy thông tin tin tức thành công",
  data: {
    ...news.get({ plain: true }),
    image: getAvatarURL(news.image),
  },
});

}

// Thêm tin tức mới
export async function insertNewsArticle(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    // Tạo bài viết trong transaction
    const newsArticle = await db.News.create(req.body, { transaction });

    // Lấy danh sách product_ids từ body
    const productIds = req.body.product_ids;

    if (productIds && productIds.length) {
      // Truy vấn các sản phẩm có ID nằm trong danh sách gửi lên
      const validProducts = await db.Product.findAll({
        where: {
          id: productIds,
        },
        transaction,
      });

      // Lấy danh sách ID sản phẩm hợp lệ
      const validProductIds = validProducts.map(product => product.id);

      // Lọc lại danh sách product_ids để chỉ giữ ID hợp lệ
      const filteredProductIds = productIds.filter(id =>
        validProductIds.includes(id)
      );

      // Tạo danh sách các bản ghi NewsDetail
      const newsDetailPromises = filteredProductIds.map(product_id =>
        db.NewsDetail.create(
          {
            product_id,
            news_id: newsArticle.id,
          },
          { transaction }
        )
      );

      await Promise.all(newsDetailPromises);
    }

    await transaction.commit();

   return res.status(201).json({
  message: "Thêm tin tức thành công",
  data: {
    ...newsArticle.get({ plain: true }),
    image: getAvatarURL(newsArticle.image),
  },
});

  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      message: "Có lỗi xảy ra khi thêm tin tức",
      error: error.message,
    });
  }

}


// Xoá tin tức
export async function deleteNewsArticle(req, res) {
  const { id } = req.params;
  //dùng transaction để rollback nếu có 1 lệnh ko chạy
  const transaction = await db.sequelize.transaction();

  try {
    // Xóa tất cả NewsDetail có liên quan đến news_id
    await db.NewsDetail.destroy({
      where: { news_id: id },
      transaction,
    });

    // Xóa bản tin trong bảng News
    const deleted = await db.News.destroy({
      where: { id },
      transaction,
    });

    if (deleted) {
      await transaction.commit();
      return res.status(200).json({
        message: "Xóa tin tức thành công",
      });
    } else {
      await transaction.rollback();
      return res.status(404).json({
        message: "Tin tức không tìm thấy",
      });
    }
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa tin tức",
      error: error.message,
    });
  }
}

// Cập nhật tin tức
export async function updateNewsArticle(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  // Kiểm tra xem title có trùng với bài viết khác (trừ chính nó)
  const existingNews = await db.News.findOne({
    where: {
      title: title,
      id: { [Op.ne]: id }, // Loại trừ chính bài viết đang cập nhật
    },
  });

  if (existingNews) {
    return res.status(400).json({
      message: 'Tiêu đề bài viết đã tồn tại, vui lòng chọn tiêu đề khác.',
    });
  }

  // Tiến hành cập nhật nếu không trùng
  const updatedNews = await db.News.update(req.body, {
    where: { id },
  });

  if (updatedNews[0] > 0) {
    return res.status(200).json({
      message: 'Cập nhật tin tức thành công',
    });
  }

  return res.status(404).json({
    message: 'Tin tức không tìm thấy',
  });
}

