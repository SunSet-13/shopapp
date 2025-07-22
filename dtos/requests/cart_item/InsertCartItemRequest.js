import joi from "joi";
class InsertCartItemRequest {
    constructor(data) {
        this.cart_id = data.cart_id;
        this.product_variant_id = data.product_variant_id; // Thêm dòng này
        this.quantity = data.quantity;
    }
    static validate(data) {
        const schema = joi.object({
            cart_id: joi.number().integer().required(),
            product_variant_id: joi.number().integer().required(), // Thêm dòng này
            quantity: joi.number().integer().min(1).required()
        });
        return schema.validate(data);
    }
}
export default InsertCartItemRequest;
// filepath: d:\learn-code-kttv\shopapp\dtos\requests\cart_item\InsertCartItemRequest.js