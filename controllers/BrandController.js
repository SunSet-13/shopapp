
import { Sequelize } from "sequelize";
import db from "../models/index";
const {Op} = Sequelize;
export async function getBrand(req, res) {
  const {Op} = Sequelize;
  
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

    const [brands, totalCount] = await Promise.all([
      db.Brand.findAll({
        where: whereClause,
        limit: pageSize,
        offset: offset
      }),
      db.Brand.count({
        where: whereClause
      })
    ]);

    return res.status(200).json({
      message: 'Lấy danh sách thương hiệu thành công',
      data: brands,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / pageSize),
      totalBrands: totalCount
    });
  
  
}

export async function getBrandById(req, res) {
  const {id} = req.params;
  const brand = await db.Brand.findByPk(id);
  if(!brand) {
    return res.status(404).json({
      message: 'Thương hiệu không tìm thấy',
    });
  }
    res.status(200).json({
        message: 'Lấy thông tin thương hiệu thành công',
        data: brand,
    });
}

export async function insertBrand(req, res) {
  try {
    // Thêm brand mới với dữ liệu từ req.body
    const brand = await db.Brand.create(req.body);
    res.status(201).json({
      message: "Thêm thương hiệu thành công",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm thương hiệu",
      error: error.message,
    });
  }
}


export async function deleteBrand(req, res) {
  const { id } = req.params;

  try {
    const deleted = await db.Brand.destroy({
      where: { id },
    });

    if (deleted) {
      return res.status(200).json({
        message: "Xóa thương hiệu thành công",
      });
    }

    return res.status(404).json({
      message: "Thương hiệu không tìm thấy",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
}

export async function updateBrand(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  // Kiểm tra xem tên thương hiệu có bị trùng không (ngoại trừ chính nó)
  const existingBrand = await db.Brand.findOne({
    where: {
      name: name,
      id: { [Op.ne]: id }, // loại trừ chính thương hiệu đang cập nhật
    },
  });

  if (existingBrand) {
    return res.status(400).json({
      message: 'Tên thương hiệu đã tồn tại, vui lòng chọn tên khác.',
    });
  }

  // Tiến hành cập nhật nếu không trùng tên
  const updatedBrand = await db.Brand.update(req.body, {
    where: { id },
  });

  if (updatedBrand[0] > 0) {
    return res.status(200).json({
      message: 'Cập nhật thương hiệu thành công',
    });
  }

  return res.status(404).json({
    message: 'Thương hiệu không tìm thấy',
  });
}

