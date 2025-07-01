const validate = (requestType) => {
  return (req, res, next) => {
    const { error } = requestType.validate(req.body); // validate dữ liệu trong req.body theo schema đã định nghĩa trong requestType
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        error: error.details[0].message, // trả về thông báo lỗi chi tiết
      });
    }
    next(); // nếu không có lỗi, tiếp tục xử lý request
  };
};
export default validate;