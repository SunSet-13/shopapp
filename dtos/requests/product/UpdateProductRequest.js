import Joi from "joi";

class UpdateProductRequest {
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
    this.attributes = data.attributes;
    this.variant_combination = data.variant_combination; // Thêm trường variant_combination
  }

  static validate(data) {
    // Nếu trường nào có thì phải đúng định dạng, không bắt buộc phải có
    const schema = Joi.object({
      name: Joi.string().optional().allow(null),
      price: Joi.number().positive().optional().allow(null),
      oldprice: Joi.number().positive().optional().allow(null),
      image: Joi.string().optional().allow(null, ""),
      description: Joi.string().optional().allow(null, ""),
      specification: Joi.string().optional().allow(null, ""),
      buyturn: Joi.number().integer().min(0).optional().allow(null),
      quantity: Joi.number().integer().min(0).optional().allow(null),
      brand_id: Joi.number().integer().optional().allow(null),
      category_id: Joi.number().integer().optional().allow(null),
      attributes: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required(),
      })).optional().allow(null),
      variant_combination: Joi.any().optional(),
    });

    return schema.validate(data, { abortEarly: false });
  }
}

export default UpdateProductRequest;
