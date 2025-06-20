import Joi from "joi";

class InsertBannerRequest {
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.status = data.status;
  }

  static validate(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      image: Joi.string().allow("", null).optional(),
      status: Joi.number().integer().greater(0).required()
    });

    return schema.validate(data);
  }
}

export default InsertBannerRequest;
