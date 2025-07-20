import { getUserFromToken } from '../helpers/tokenHelper.js'; // Đúng đường dẫn và đúng kiểu export

const requireRoles = (rolesRequired) => async (req, res, next) => {
  const user = await getUserFromToken(req, res); // Lấy thông tin user từ token
  console.log(user.role, rolesRequired); // Kiểm tra thông tin user
  
  if (!user) return; // Nếu không có user, getUserFromToken đã xử lý lỗi

  if ( user.is_locked === 1) {
    return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
  }

  if (!rolesRequired.includes(user.role)) {
    // Nếu role của user không nằm trong danh sách rolesRequired
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }

  req.user = user; // Lưu thông tin user vào request để các middleware/route sau dùng
  next(); // Cho phép đi tiếp
};
export { requireRoles };