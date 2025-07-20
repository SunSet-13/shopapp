// File: imageHelper.js
import os from 'os';


export const getAvatarURL = (imageName) => {
  if (!imageName) return ""; // Trả về null nếu không có tên ảnh
  if (!imageName.includes('http')) {
    const API_PREFIX = `http://${os.hostname()}:${process.env.PORT || 3000}/api`;
    return `${API_PREFIX}/images/${imageName}`;
  }
  return imageName;
};
