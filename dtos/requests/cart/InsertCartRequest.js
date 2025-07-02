import joi from "joi";
class InsertCartRequest {
    constructor(data) {
        this.user_id = data.user_id; // ID của người dùng
       this.image = data.image;
       this.content = data.content;
       this.product_ids = data.product_ids // Mảng các mục trong giỏ hàng
    }
    static validate(data) {
        const schema = joi.object({
            user_id: joi.number().integer().required(),
            image: joi.string().uri().allow("", null).optional(),
            content: joi.string().required(),
            product_ids: joi.array().items(joi.number().integer()).required() // Mảng các ID sản phẩm
        });
        return schema.validate(data);
    }

}
export default InsertCartRequest;