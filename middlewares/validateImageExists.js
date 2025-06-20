import fs from 'fs';
import path from 'path';

// Middleware kiểm tra sự tồn tại của ảnh trong thư mục uploads (nếu không phải ảnh từ URL)
const validateImageExists = (req, res, next) => {
  const imageName = req.body.image; // Lấy tên ảnh từ request

  // Chỉ kiểm tra nếu imageName có giá trị và không bắt đầu bằng http:// hoặc https://
  if (imageName && !imageName.startsWith('http://') && !imageName.startsWith('https://')) {
    const imagePath = path.join(__dirname, '../uploads', imageName); // Tạo đường dẫn tuyệt đối tới ảnh

    // Kiểm tra file ảnh có tồn tại trong thư mục uploads không
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        message: 'File ảnh không tồn tại' // Trả về lỗi nếu không tìm thấy ảnh
      });
    }
  }

  // Nếu ảnh là URL hoặc không có ảnh, hoặc ảnh hợp lệ thì tiếp tục middleware/controller tiếp theo
  next();
};

export default validateImageExists;
