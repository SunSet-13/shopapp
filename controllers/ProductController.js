export async function getProduct(req, res) {
    res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
    });
}
export async function getProductById(req, res) {
    res.status(200).json({
        message: 'Lấy thông tin sản phẩm thành công',
    });
}

export async function insertProduct(req, res) {
    res.status(200).json({
        message: 'Thêm sản phẩm thành công',
    });
}
export async function deleteProduct(req, res) {
    res.status(200).json({
        message: 'Xóa sản phẩm thành công',
    });
}
export async function updateProduct(req, res) {
    res.status(200).json({
        message: 'Cập nhật sản phẩm thành công',
    });
}