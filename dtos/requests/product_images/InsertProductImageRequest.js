import joi from 'joi';
class InsertProductImageRequest {
    constructor(data) {
        this.image_url = data.image_url;    
        this.product_id = data.product_id;
    }
    static validate(data){
        const schema = joi.object({
            image_url: joi.string().required(),
            product_id: joi.number().integer().required()
        })
        return schema.validate(data); // trả về dạng key value

    }
}
export default InsertProductImageRequest;