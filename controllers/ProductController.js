import { Sequelize } from "sequelize";
import db from "../models/index.js";
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest.js";
import e from "express";
import { getAvatarURL } from "../helpers/imageHelper.js";
const { Op } = Sequelize;
export async function getProduct(req, res) {
  //const products = await db.Product.findAll()
  const { search = "", page = 1 } = req.query;
  const pageSize = 6;
  const offset = (page - 1) * pageSize; //5, trang 2 bắt đầu từ sp số 6
  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { specification: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  const [products, totalProducts] = await Promise.all([
    db.Product.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.Product.count({
      where: whereClause,
    }),
  ]);
  res.status(200).json({
  message: "Lấy danh sách sản phẩm thành công",
  data: products.map(product => ({
    ...product.get({ plain: true }),
    image: getAvatarURL(product.image),
  })),
  current_page: parseInt(page, 10),
  total_page: Math.ceil(totalProducts / pageSize),
  total: totalProducts,
});

}
export async function getProductById(req, res) {
  const { id } = req.params;

  const product = await db.Product.findByPk(id, {
    include: [
      {
        model: db.ProductImage,
        as: 'productImages', // Ảnh sản phẩm liên kết
      },
      {
        model: db.ProductAttributeValue,
        as: 'attributes', // Thuộc tính động
        include: [
          {
            model: db.Attribute,
            attributes: ['name'], // Chỉ lấy tên thuộc tính
          },
        ],
      },
    ],
  });

  if (!product) {
    return res.status(404).json({
      message: 'Sản phẩm không tìm thấy',
    });
  }

  return res.status(200).json({
    message: 'Lấy thông tin sản phẩm thành công',
    data: {
      ...product.get({ plain: true }),
      image: getAvatarURL(product.image),
    },
  });
}




export async function insertProduct(req, res) {
  const { name, attributes = [], ...productData } = req.body;

  // Kiểm tra trùng tên sản phẩm
  const productExists = await db.Product.findOne({ where: { name } });
  if (productExists) {
    return res.status(400).json({
      message: 'Tên sản phẩm đã tồn tại, vui lòng chọn tên khác',
    });
  }

  try {
    // Tạo sản phẩm mới trong bảng `products`
    const product = await db.Product.create({ name, ...productData });

    // Duyệt qua từng thuộc tính động
    for (const attr of attributes) {
      // Tìm hoặc tạo thuộc tính trong bảng `attributes`
      const [attribute] = await db.Attribute.findOrCreate({
        where: { name: attr.name },
      });

      // Thêm giá trị thuộc tính vào bảng `product_attribute_values`
      await db.ProductAttributeValue.create({
        product_id: product.id,
        attribute_id: attribute.id,
        value: attr.value,
      });
    }

    // Trả về thông tin sản phẩm kèm các thuộc tính động
    return res.status(201).json({
      message: 'Thêm mới sản phẩm thành công',
      data: {
        ...product.get({ plain: true }),
        image: getAvatarURL(product.image),
        attributes: attributes.map(attr => ({
          name: attr.name,
          value: attr.value,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi thêm sản phẩm',
      error: error.message,
    });
  }
}




export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem sản phẩm có trong bất kỳ OrderDetail nào không
  const orderDetailExists = await db.OrderDetail.findOne({
    where: { product_id: id },
    include: [
      {
        model: db.Order,
        as: 'Order',
        attributes: ['id', 'status', 'note', 'total', 'created_at'],
      },
    ],
  });

  if (orderDetailExists) {
    return res.status(400).json({
      message: 'Không thể xóa sản phẩm vì đã có đơn hàng tham chiếu đến sản phẩm này',
      data: orderDetailExists.order,
    });
  }

  // Xóa các bản ghi trong bảng `product_attribute_values` liên quan đến sản phẩm
  await db.ProductAttributeValue.destroy({
    where: { product_id: id },
  });

  // Xóa sản phẩm khỏi bảng `products`
  const deleted = await db.Product.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: 'Xóa sản phẩm thành công',
    });
  } else {
    return res.status(404).json({
      message: 'Sản phẩm không tìm thấy',
    });
  }
};


export async function updateProduct(req, res) {
  const { id } = req.params;
  const { attributes = [], ...productData } = req.body;

  // Cập nhật thông tin cơ bản của sản phẩm trong bảng `products`
  const [updatedRowCount] = await db.Product.update(productData, {
    where: { id },
  });

  if (updatedRowCount > 0) {
    // Nếu cập nhật thành công, tiến hành cập nhật thuộc tính động
    for (const attr of attributes) {
      // Tìm hoặc tạo thuộc tính trong bảng `attributes`
      const [attribute] = await db.Attribute.findOrCreate({
        where: { name: attr.name },
      });

      // Tìm xem thuộc tính đã tồn tại cho sản phẩm chưa
      const productAttributeValue = await db.ProductAttributeValue.findOne({
        where: {
          product_id: id,
          attribute_id: attribute.id,
        },
      });

      if (productAttributeValue) {
        // Nếu thuộc tính đã tồn tại, cập nhật giá trị
        await productAttributeValue.update({ value: attr.value });
      } else {
        // Nếu chưa tồn tại, thêm mới thuộc tính và giá trị vào bảng `product_attribute_values`
        await db.ProductAttributeValue.create({
          product_id: id,
          attribute_id: attribute.id,
          value: attr.value,
        });
      }
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
    });
  }

  return res.status(404).json({
    message: "Sản phẩm không tìm thấy",
  });
}

/*
[
  {
    "name": "Xiaomi 13 Pro",
    "price": 18990000,
    "oldprice": 20990000,
    "image": "",
    "description": "Xiaomi 13 Pro với thiết kế cao cấp và camera Leica mang lại trải nghiệm hình ảnh đỉnh cao.",
    "specification": "Màn hình AMOLED 6.73 inch 3200x1440; Snapdragon 8 Gen 2; RAM 12GB; ROM 256GB; Camera sau 50MP + 50MP + 50MP; Trước 32MP; Pin 4820mAh, sạc nhanh 120W.",
    "buyturn": 215,
    "quantity": 50,
    "brand_id": 3,
    "category_id": 3
  },
  {
    "name": "iPhone 14 Pro Max",
    "price": 30990000,
    "oldprice": 33990000,
    "image": "",
    "description": "iPhone 14 Pro Max mang đến Dynamic Island, chip A16 Bionic và camera chuyên nghiệp.",
    "specification": "Màn hình Super Retina XDR 6.7 inch; A16 Bionic; RAM 6GB; ROM 256GB; Camera sau 48MP + 12MP + 12MP; Trước 12MP; Pin 4323mAh.",
    "buyturn": 430,
    "quantity": 40,
    "brand_id": 4,
    "category_id": 3
  },
  {
    "name": "LG Velvet 5G",
    "price": 10990000,
    "oldprice": 12990000,
    "image": "",
    "description": "LG Velvet 5G có thiết kế mỏng nhẹ, sang trọng và hiệu năng tốt.",
    "specification": "P-OLED 6.8 inch 2460x1080; Snapdragon 765G; RAM 6GB; ROM 128GB; Camera sau 48MP + 8MP + 5MP; Trước 16MP; Pin 4300mAh.",
    "buyturn": 102,
    "quantity": 25,
    "brand_id": 5,
    "category_id": 3
  },
  {
    "name": "LGB Aura 11",
    "price": 8990000,
    "oldprice": 9990000,
    "image": "",
    "description": "LGB Aura 11 đem lại hiệu suất ổn định và thiết kế hiện đại.",
    "specification": "IPS LCD 6.5 inch; MediaTek Helio G95; RAM 8GB; ROM 128GB; Camera sau 64MP + 8MP + 2MP; Trước 16MP; Pin 5000mAh.",
    "buyturn": 88,
    "quantity": 30,
    "brand_id": 7,
    "category_id": 3
  },
  {
    "name": "Galaxy Z Fold4",
    "price": 44990000,
    "oldprice": 47990000,
    "image": "",
    "description": "Galaxy Z Fold4 mở ra kỷ nguyên điện thoại gập thông minh với hiệu suất cao và đa nhiệm tốt.",
    "specification": "Màn hình chính 7.6 inch QXGA+; Snapdragon 8+ Gen 1; RAM 12GB; ROM 512GB; Camera 50MP + 12MP + 10MP; Trước 10MP + 4MP; Pin 4400mAh.",
    "buyturn": 160,
    "quantity": 20,
    "brand_id": 1,
    "category_id": 3
  },
  {
    "name": "Xiaomi Redmi Note 12",
    "price": 5290000,
    "oldprice": 5990000,
    "image": "",
    "description": "Redmi Note 12 với màn hình AMOLED 120Hz và pin khủng.",
    "specification": "AMOLED 6.67 inch FHD+; Snapdragon 685; RAM 8GB; ROM 128GB; Camera sau 50MP + 8MP + 2MP; Trước 13MP; Pin 5000mAh.",
    "buyturn": 198,
    "quantity": 100,
    "brand_id": 3,
    "category_id": 3
  },
  {
    "name": "iPhone SE 2022",
    "price": 11990000,
    "oldprice": 12990000,
    "image": "",
    "description": "iPhone SE 2022 nhỏ gọn, mạnh mẽ với chip A15 Bionic.",
    "specification": "Retina HD 4.7 inch; A15 Bionic; RAM 4GB; ROM 128GB; Camera sau 12MP; Trước 7MP; Pin 2018mAh.",
    "buyturn": 122,
    "quantity": 60,
    "brand_id": 4,
    "category_id": 3
  },
  {
    "name": "LG Wing 5G",
    "price": 15990000,
    "oldprice": 17990000,
    "image": "",
    "description": "LG Wing với thiết kế xoay độc đáo, trải nghiệm đa nhiệm sáng tạo.",
    "specification": "P-OLED 6.8 inch + G-OLED 3.9 inch; Snapdragon 765G; RAM 8GB; ROM 128GB; Camera 64MP + 13MP + 12MP; Trước 32MP; Pin 4000mAh.",
    "buyturn": 75,
    "quantity": 15,
    "brand_id": 5,
    "category_id": 3
  },
  {
    "name": "LGB Star X",
    "price": 7590000,
    "oldprice": 8990000,
    "image": "",
    "description": "LGB Star X với chip tiết kiệm điện năng và thời lượng pin ấn tượng.",
    "specification": "IPS LCD 6.6 inch; Unisoc T616; RAM 6GB; ROM 128GB; Camera sau 50MP; Trước 8MP; Pin 6000mAh.",
    "buyturn": 51,
    "quantity": 40,
    "brand_id": 7,
    "category_id": 3
  },
  {
    "name": "Galaxy A54",
    "price": 9490000,
    "oldprice": 10490000,
    "image": "",
    "description": "Galaxy A54 mang đến màn hình Super AMOLED cùng khả năng chụp ảnh tốt.",
    "specification": "Super AMOLED 6.4 inch; Exynos 1380; RAM 8GB; ROM 128GB; Camera 50MP + 12MP + 5MP; Trước 32MP; Pin 5000mAh.",
    "buyturn": 170,
    "quantity": 90,
    "brand_id": 1,
    "category_id": 3
  },
  {
    "name": "Xiaomi POCO F5",
    "price": 8990000,
    "oldprice": 9990000,
    "image": "",
    "description": "POCO F5 mang lại hiệu năng mạnh mẽ trong tầm giá nhờ chip Snapdragon 7+ Gen 2.",
    "specification": "AMOLED 6.67 inch; Snapdragon 7+ Gen 2; RAM 8GB; ROM 256GB; Camera sau 64MP + 8MP + 2MP; Trước 16MP; Pin 5000mAh.",
    "buyturn": 136,
    "quantity": 85,
    "brand_id": 3,
    "category_id": 3
  },
  {
    "name": "iPhone 13",
    "price": 21990000,
    "oldprice": 23990000,
    "image": "",
    "description": "iPhone 13 với thiết kế cân đối, chip A15 và camera cải tiến.",
    "specification": "Super Retina XDR 6.1 inch; A15 Bionic; RAM 4GB; ROM 128GB; Camera 12MP + 12MP; Trước 12MP; Pin 3240mAh.",
    "buyturn": 310,
    "quantity": 70,
    "brand_id": 4,
    "category_id": 3
  },
  {
    "name": "LG Q92",
    "price": 7490000,
    "oldprice": 8490000,
    "image": "",
    "description": "LG Q92 5G hỗ trợ kết nối nhanh, thiết kế bền bỉ.",
    "specification": "IPS LCD 6.67 inch; Snapdragon 765G; RAM 6GB; ROM 128GB; Camera 48MP + 8MP + 5MP + 2MP; Trước 32MP; Pin 4000mAh.",
    "buyturn": 84,
    "quantity": 20,
    "brand_id": 5,
    "category_id": 3
  },
  {
    "name": "LGB Note Z",
    "price": 6790000,
    "oldprice": 7890000,
    "image": "",
    "description": "LGB Note Z nổi bật với màn hình lớn, pin trâu, hỗ trợ học tập và giải trí tốt.",
    "specification": "LCD 6.9 inch; Helio G85; RAM 6GB; ROM 128GB; Camera 50MP + 2MP; Trước 8MP; Pin 6000mAh.",
    "buyturn": 65,
    "quantity": 25,
    "brand_id": 7,
    "category_id": 3
  },
  {
    "name": "Galaxy S21 FE",
    "price": 12990000,
    "oldprice": 14990000,
    "image": "",
    "description": "Galaxy S21 FE cân bằng giữa hiệu năng và giá thành, dành cho người trẻ.",
    "specification": "Dynamic AMOLED 2X 6.4 inch; Exynos 2100; RAM 8GB; ROM 128GB; Camera 12MP + 12MP + 8MP; Trước 32MP; Pin 4500mAh.",
    "buyturn": 248,
    "quantity": 35,
    "brand_id": 1,
    "category_id": 3
  },
  {
    "name": "Xiaomi 12T Pro",
    "price": 13990000,
    "oldprice": 15990000,
    "image": "",
    "description": "Xiaomi 12T Pro sở hữu camera 200MP cùng hiệu năng khủng từ Snapdragon 8+ Gen 1.",
    "specification": "AMOLED 6.67 inch; Snapdragon 8+ Gen 1; RAM 8GB; ROM 256GB; Camera 200MP + 8MP + 2MP; Trước 20MP; Pin 5000mAh.",
    "buyturn": 199,
    "quantity": 55,
    "brand_id": 3,
    "category_id": 3
  },
  {
    "name": "iPhone 15",
    "price": 25990000,
    "oldprice": 28990000,
    "image": "",
    "description": "iPhone 15 với cổng USB-C, chip A16 Bionic và camera nâng cấp.",
    "specification": "Super Retina XDR 6.1 inch; A16 Bionic; RAM 6GB; ROM 128GB; Camera 48MP + 12MP; Trước 12MP; Pin 3349mAh.",
    "buyturn": 325,
    "quantity": 65,
    "brand_id": 4,
    "category_id": 3
  }
]

*/
