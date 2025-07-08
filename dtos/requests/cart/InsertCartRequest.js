import joi from "joi";
class InsertCartRequest {
    constructor(data) {
        this.session_id = data.session_id; // ID của phiên làm việc
        this.user_id = data.user_id; // ID của người dùng (nếu có)
    }
    static validate(data) {
        const schema = joi.object({
            user_id: joi.number().integer().optional(),
            session_id: joi.string().required() // ID của phiên làm việc là chuỗi
        });
        return schema.validate(data);
    }

}
export default InsertCartRequest;