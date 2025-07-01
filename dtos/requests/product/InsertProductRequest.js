// Khi bạn nhận request POST thêm sản phẩm:

// Backend nhận req.body

// Gọi InsertProductRequest.validate(req.body)

// Nếu error, trả về 400

// Nếu không, tiếp tục insert vào DB
import Joi from "joi";
class InsertProductRequest {
  
  constructor(data) {
    this.name = data.name;
    this.price = data.price;
    this.oldprice = data.oldprice;
    this.image = data.image;
    this.description = data.description;
    this.specification = data.specification;
    this.buyturn = data.buyturn;
    this.quantity = data.quantity;
    this.brand_id = data.brand_id;
    this.category_id = data.category_id;
  }
  static validate(data) {
     const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      oldprice: Joi.number().positive(),
      image: Joi.string().allow(""),
      description: Joi.string().optional(),
      specification: Joi.string().required(),
      buyturn: Joi.number().integer().min(0),
      quantity: Joi.number().integer().positive().required(), // Thêm .positive()
      brand_id: Joi.number().integer().required(),
      category_id: Joi.number().integer().required(),
    });
    return schema.validate(data);//trả về dạng key value
  }
}
export default InsertProductRequest;
