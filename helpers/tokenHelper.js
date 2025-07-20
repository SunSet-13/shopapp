import jwt from 'jsonwebtoken';
import db from '../models';
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Hàm kiểm tra và lấy thông tin người dùng từ token
 */
async function getUserFromToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Không có token được cung cấp' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // ✅ Kiểm tra token có được tạo trước khi người dùng đổi mật khẩu không
    // issued at = decoded.iat
    if (
      user.password_changed_at &&
      decoded.iat < new Date(user.password_changed_at).getTime() / 1000
    ) {
      return res
        .status(401)
        .json({ message: 'Token không hợp lệ do mật khẩu đã thay đổi' });
    }

    return user;
  } catch (error) {
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn',
      error: error.toString(),
    });
  }
}

export { getUserFromToken };
