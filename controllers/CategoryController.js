export async function getCategory(req, res) {
    res.status(200).json({
        message: 'Lấy danh sách danh mục thành công',
    });
}

export async function getCategoryById(req, res) {
    res.status(200).json({
        message: 'Lấy thông tin danh mục thành công',
    });
}

export async function insertCategory(req, res) {
    res.status(200).json({
        message: 'Thêm danh mục thành công',
    });
}

export async function deleteCategory(req, res) {
    res.status(200).json({
        message: 'Xóa danh mục thành công',
    });
}

export async function updateCategory(req, res) {
    res.status(200).json({
        message: 'Cập nhật danh mục thành công',
    });
}
