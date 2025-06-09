import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';
dotenv.config();
const app = express();
app.use(express.json());  //thêm middleware để parse JSON request body
app.use(express.urlencoded({ extended: true }));//thêm middleware để parse URL-encoded request body

app.get('/',(req,res)=>{
    
    res.send('Hello World! 111');
})

routes(app); // gọi đến AppRoute để đăng ký các route

const port = process?.env?.PORT ?? 3000 //nếu null thì không gọi vào Port, dùng mặc định 3000

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})

