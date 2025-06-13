import Joi from "joi";

class InsertNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
    this.product_id = data.product_id; // dạng mảng số nguyên
  }

  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().required(),
      image: Joi.string().uri().allow("",null).optional(),
      content: Joi.string().required(),
      product_ids: Joi.array().items(Joi.number().integer()).required() // Đổi tên từ product_id thành product_ids
    });
    return schema.validate(data);
  }
}

export default InsertNewsRequest;
