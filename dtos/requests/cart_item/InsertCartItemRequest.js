import joi from "joi";
class InsertCartItemRequest {
    constructor(data){
        this.cart_id = data.cart_id; // ID của giỏ hàng
        this.product_id = data.product_id; // ID của sản phẩm
        this.quantity = data.quantity; // Số lượng sản phẩm trong giỏ
    }
    static validate(data){
        const schema = joi.object({
            cart_id: joi.number().integer().required(),
            product_id: joi.number().integer().required(),  
            quantity: joi.number().integer().min(0).required() // Số lượng phải là số nguyên dương

        })
        return schema.validate(data,{ abortEarly: false} );
    }
    
}
export default InsertCartItemRequest;