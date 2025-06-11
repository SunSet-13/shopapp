import { Sequelize } from "sequelize";
import db from "../models/index";
const {Op} = Sequelize;
export async function getCategory(req, res) {
 
    const { search = '', page = 1 } = req.query;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    let whereClause = {};
    if (search.trim() !== '') {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          
        ]
      };
    }

    const [categories, totalCategories] = await Promise.all([
      db.Category.findAll({
        where: whereClause,
        limit: pageSize,
        offset: offset
      }),
      db.Category.count({
        where: whereClause
      })
    ]);

    return res.status(200).json({
      message: 'Lấy danh sách danh mục thành công',
      data: categories,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalCategories/ pageSize),
      totalCategories
    });
 
}

export async function getCategoryById(req, res) {
  const {id} = req.params;
  const category = await db.Category.findByPk(id);
  if(!category) {
    return res.status(404).json({
      message: 'Danh mục không tìm thấy',
    });
  }
    res.status(200).json({
        message: 'Lấy thông tin danh mục thành công',
        data: category,
    });
}

export async function insertCategory(req, res) {
  // Thêm category mới với dữ liệu từ req.body
  const category = await db.Category.create(req.body);
  res.status(201).json({
    message: "Thêm danh mục thành công",
    data: category,
  });
}


export async function deleteCategory(_, res) {
    res.status(200).json({
        message: 'Xóa danh mục thành công',
    });
}

export async function updateCategory(_, res) {
    res.status(200).json({
        message: 'Cập nhật danh mục thành công',
    });
}
