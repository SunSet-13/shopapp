/*
- Upload file to Local server
- Upload image file to Google Firebase(Firestore)
- Cloundinary, AWS
*/
import path from 'path'
export async function uploadImages(req, res) {
    //kiểm tra nếu không có ảnh nào  được tải lên 
    if (!req.files || req.files.length === 0){
        throw new Error('Không có file nào được tải lên ')
    }
    //trả về đường dẫn của các file ảnh được tải lên 
    const uploadedImagesPaths = req.files.map(file => path.basename(file.path));
    res.status(201).json({
         message: 'Tải ảnh thành công',
         files: uploadedImagesPaths

    })
    
}
 