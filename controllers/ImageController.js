/*
- Upload file to Local server
- Upload image file to Google Firebase(Firestore)
- Cloundinary, AWS
*/
import path from 'path'
import fs from 'fs'
import { error } from 'console';
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
 
export async function viewImage(req, res) {
    const { fileName } = req.params;
    const imagePath = path.join( path.join(__dirname, "../uploads/"), fileName)
    fs.access(imagePath,fs.constants.F_OK, (error) => {
        if(error){
            return res.status(404).send('Image Not Found')
        }
        res.sendFile(imagePath)

})
}