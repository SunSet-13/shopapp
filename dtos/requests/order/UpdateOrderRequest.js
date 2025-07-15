import Joi from "joi";
import OrderStatus from "../../../constants";



class UpdateOrderRequest {
  constructor(data) {
    this.status = data.status;
    this.note = data.note;
    this.total = data.total;
  }

  static validate(data) {
    const schema = Joi.object({
      status: Joi.number()
        .valid(...Object.values(OrderStatus))
        .optional(),
      note: Joi.string().allow("").optional(),
      total: Joi.number().min(0).optional(),
    });

    return schema.validate(data, { abortEarly: false });
  }
}

export default UpdateOrderRequest;
