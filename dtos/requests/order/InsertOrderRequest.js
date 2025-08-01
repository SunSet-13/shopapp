import Joi from "joi";

class InsertOrderRequest {
  constructor(data) {
    this.user_id = data.user_id;
    this.status = data.status;
    this.note = data.note;
    this.total = data.total;
    this.phone = data.phone || "";
    this.address = data.address || "";
  }

  static validate(data) {
    const schema = Joi.object({
      user_id: Joi.number().integer().required(),
      status: Joi.number().integer().greater(0).required(),
      note: Joi.string().optional().allow(""),
      total: Joi.number().min(0).required(),
      phone: Joi.string().pattern(/^[0-9]+$/).optional().allow(""),
      address: Joi.string().optional().allow(""),
    });

    return schema.validate(data);
  }
}

export default InsertOrderRequest;
