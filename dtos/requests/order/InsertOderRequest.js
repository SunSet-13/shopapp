import Joi from "joi";

class InsertOderRequest {
  constructor(data) {
    this.user_id = data.user_id;
    this.status = data.status;
    this.note = data.note;
    this.total = data.total;
  }

  static validate(data) {
    const schema = Joi.object({
      user_id: Joi.number().integer().required(),
      status: Joi.number().integer().greater(0).required(),
      note: Joi.string().optional().allow(""),
      total: Joi.number().min(0).required(),
    });

    return schema.validate(data);
  }
}

export default InsertOderRequest;
