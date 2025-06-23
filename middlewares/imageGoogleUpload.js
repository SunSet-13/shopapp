import multer from "multer";

const uploadImagesMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(new Error("Chỉ được phép gửi lên file ảnh!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadImagesMiddleware;
