import Joi from "joi";

class UpdateNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
    this.product_ids = data.product_ids; // dạng mảng số nguyên
  }

  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().allow(null).optional(),
      image: Joi.string().uri().allow(null, "").optional(),
      content: Joi.string().allow(null).optional(),
      product_ids: Joi.array()
        .items(Joi.number().integer())
        .allow(null)
        .optional(),
    });

    return schema.validate(data);
  }
}

export default UpdateNewsRequest;
