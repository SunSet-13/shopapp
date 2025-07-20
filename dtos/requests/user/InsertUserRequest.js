import Joi from "joi";
import  UserRole  from '../../../constants/UserRole.js';

class InsertUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password =data.password;
    //this.password = this.encryptPassword(data.password); // Phải được mã hóa trước khi lưu
    this.name = data.name;
   // this.role = data.role;
    this.avatar = data.avatar;
    this.phone = data.phone;
    this.new_password = data.new_password;
    this.old_password = data.old_password
  }
  

  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(), // Gọi encrypt() trước khi lưu
      name: Joi.string().required(),
      //role: Joi.number().integer().min(UserRole.USER).required(),
      avatar: Joi.string().allow("").optional(),
      phone: Joi.string().pattern(/^[0-9]{9,15}$/).allow("").optional(),
      old_password: Joi.string().min(6).optional(), 
    new_password: Joi.string().min(6).optional(), 
    });

    return schema.validate(data);
  }
}

export default InsertUserRequest;
