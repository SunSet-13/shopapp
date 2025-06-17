import db from "../models";

// Lấy danh sách tất cả chi tiết banner
export const getBannerDetail = async (req, res) => {
  const bannerDetails = await db.BannerDetail.findAll();
  res.status(200).json({
    message: "Lấy danh sách chi tiết banner thành công",
    data: bannerDetails,
  });
};

// Lấy chi tiết banner theo ID
export const getBannerDetailById = async (req, res) => {
  const { id } = req.params;
  const bannerDetail = await db.BannerDetail.findByPk(id);
  if (!bannerDetail) {
    return res.status(404).json({
      message: "Chi tiết banner không tìm thấy",
    });
  }
  res.status(200).json({
    message: "Lấy thông tin chi tiết banner thành công",
    data: bannerDetail,
  });
};

// Thêm mới chi tiết banner
export const insertBannerDetail = async (req, res) => {
  const { banner_id, product_id } = req.body;

  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }

  const banner = await db.Banner.findByPk(banner_id);
  if (!banner) {
    return res.status(404).json({ message: "Banner không tồn tại" });
  }

  const existed = await db.BannerDetail.findOne({
    where: { banner_id, product_id },
  });
  if (existed) {
    return res.status(409).json({ message: "Chi tiết banner đã tồn tại" });
  }

  const newDetail = await db.BannerDetail.create({ banner_id, product_id });

  res.status(201).json({
    message: "Thêm chi tiết banner thành công",
    data: newDetail,
  });
};

// Cập nhật chi tiết banner
export const updateBannerDetail = async (req, res) => {
  const { id } = req.params;
  const { banner_id, product_id } = req.body;
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }

  const banner = await db.Banner.findByPk(banner_id);
  if (!banner) {
    return res.status(404).json({ message: "Banner không tồn tại" });
  }

  // Kiểm tra trùng lặp (ngoại trừ chính bản ghi đang cập nhật)
  const duplicate = await db.BannerDetail.findOne({
    where: {
      banner_id,
      product_id,
      id: { [db.Sequelize.Op.ne]: id }, // khác id hiện tại
    },
  });

  if (duplicate) {
    return res.status(409).json({
      message: "Chi tiết banner với product_id và banner_id này đã tồn tại",
    });
  }

  // Cập nhật
  const updated = await db.BannerDetail.update(
    { banner_id, product_id },
    { where: { id } }
  );

  if (updated[0] > 0) {
    return res.status(200).json({
      message: "Cập nhật chi tiết banner thành công",
    });
  }

  return res.status(404).json({
    message: "Chi tiết banner không tìm thấy",
  });
};


// Xoá chi tiết banner
export const deleteBannerDetail = async (req, res) => {
  const { id } = req.params;

  const deleted = await db.BannerDetail.destroy({
    where: { id },
  });

  if (deleted) {
    return res.status(200).json({
      message: "Xoá chi tiết banner thành công",
    });
  }

  res.status(404).json({
    message: "Chi tiết banner không tìm thấy",
  });
};
