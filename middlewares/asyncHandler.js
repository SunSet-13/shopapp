// async function asynceHandler(params) {

// }
//xử lý lỗi bất đồng bộ trong express
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);//đệ quy hàm fn
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error hẹ hẹ ",
        error: process.env.NODE_ENV === "development" ? error : "",
        console: error.message,
      });
    }
  };
};
export default asyncHandler;
