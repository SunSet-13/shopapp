import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig.js";


// Upload ảnh lên Firebase Storage
export async function uploadImageToGoogleStorage(req, res) {
  try {
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    // Tạo tên file mới
    const newFileName = `${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, `images/${newFileName}`);

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    // Lấy URL sau khi upload
    const downloadURL = await getDownloadURL(snapshot.ref);

    res.status(201).json({
      message: "Tải ảnh lên thành công",
      fileName: newFileName,
      file: downloadURL,
    });
  } catch (error) {
    console.error(error); // Xem log chi tiết trên terminal
    res.status(500).json({
      message: "Lỗi khi upload ảnh",
      error: error.message,
      detail: error, // Xem thêm thông tin lỗi
    });
  }
}



// Xem ảnh qua fileName
export async function viewImage(req, res) {
  const { fileName } = req.params;
  const storage = getStorage();
  const fileRef = ref(storage, `images/${fileName}`);

  getDownloadURL(fileRef)
    .then((url) => {
      return res.redirect(url);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy ảnh từ Firebase:", err);
      return res.status(404).send("Image not found");
    });
}


import path from "path";
import fs from "fs";
import { error } from "console";
import db from "../models/index.js";

export async function uploadImages(req, res) {
  //kiểm tra nếu không có ảnh nào  được tải lên
  if (!req.files || req.files.length === 0) {
    throw new Error("Không có file nào được tải lên ");
  }
  //trả về đường dẫn của các file ảnh được tải lên
  const uploadedImagesPaths = req.files.map((file) => path.basename(file.path));
  res.status(201).json({
    message: "Tải ảnh thành công",
    files: uploadedImagesPaths,
  });
}

export async function checkImageInUse(imageUrl) {
  const models = [
    db.User,
    db.Category,
    db.Brand,
    db.Product,
    db.News,
    db.Banner,
  ];

  for (let model of models) {
    // Kiểm tra model có trường image không
    if (!model.rawAttributes || !model.rawAttributes.image) continue;
    const result = await model.findOne({ where: { image: imageUrl } });
    if (result) return true;
  }

  return false;
}
export async function deleteImage(req, res) {
  const { url } = req.body;

  // Kiểm tra đầu vào
  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      message: 'Thiếu hoặc sai định dạng trường "url".',
    });
  }

  // Xử lý tên file ảnh (đã là tên ảnh luôn, không cần tách)
  const imageName = url;
  const imagePath = path.join(__dirname, '../uploads', imageName);

  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      message: `Ảnh "${imageName}" không tồn tại.`,
    });
  }

  // Kiểm tra xem ảnh có đang được sử dụng không
  const inUse = await checkImageInUse(imageName);
  if (inUse) {
    return res.status(409).json({
      message: `Không thể xóa ảnh "${imageName}" vì đang được sử dụng.`,
    });
  }

  // Xóa ảnh
  fs.unlinkSync(imagePath);
  return res.status(200).json({
    message: `Xóa ảnh "${imageName}" thành công.`,
  });
}

