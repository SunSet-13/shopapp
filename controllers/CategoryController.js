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


export async function deleteCategory(req, res) {
  const { id } = req.params;

  const deleted = await db.Category.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xóa danh mục thành công",
    });
  }

  return res.status(404).json({
    message: "Danh mục không tìm thấy",
  });
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if(name !== undefined){
   const existingCategory = await db.Category.findOne({
    where: {
      name: name,
      id: { [Op.ne]: id }, // Loại trừ chính category đang cập nhật
    },
  });

  if (existingCategory) {
    return res.status(400).json({
      message: 'Tên danh mục đã tồn tại, vui lòng chọn tên khác.',
    });
  }
  }

  // Kiểm tra xem tên mới có trùng với category khác không (trừ chính nó)
  

  // Tiến hành cập nhật
  const updatedCategory = await db.Category.update(req.body, {
    where: { id },
  });

  if (updatedCategory[0] > 0) {
    return res.status(200).json({
      message: 'Cập nhật danh mục thành công',
    });
  }

  return res.status(404).json({
    message: 'Danh mục không tìm thấy',
  });
}
