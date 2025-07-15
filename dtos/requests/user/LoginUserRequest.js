import Joi from "joi";


class LoginUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password =data.password;
    //this.password = this.encryptPassword(data.password); // Phải được mã hóa trước khi lưu
    
    this.phone = data.phone;
  }
  

  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(), // Gọi encrypt() trước khi lưu
      phone: Joi.string().pattern(/^[0-9]{9,15}$/).allow("").optional(),
    });

    return schema.validate(data);
  }
}

export default LoginUserRequest;
