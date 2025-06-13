import Joi from "joi";

class InsertUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password =data.password;
    //this.password = this.encryptPassword(data.password); // Phải được mã hóa trước khi lưu
    this.name = data.name;
    this.role = data.role;
    this.avatar = data.avatar;
    this.phone = data.phone;
  }
  

  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(), // Gọi encrypt() trước khi lưu
      name: Joi.string().required(),
      role: Joi.number().integer().min(1).required(),
      avatar: Joi.string().uri().allow("").optional(),
      phone: Joi.string().pattern(/^[0-9]{9,15}$/).allow("").optional(),
    });

    return schema.validate(data);
  }
}

export default InsertUserRequest;
