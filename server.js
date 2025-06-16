import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes";
import os from "os";
import db from "./models";
dotenv.config();
const app = express();
app.use(express.json()); //thêm middleware để parse JSON request body
app.use(express.urlencoded({ extended: true })); //thêm middleware để parse URL-encoded request body
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/healthcheck", async (req, res) => {
  try {
    //Kiểm tra kết nối cơ sở dữ liệu
    await db.sequelize.authenticate();

    // Lấy thông tin tải CPU
    const cpuLoad = os.loadavg(); // Trả về tải trung bình trong 1, 5 và 15 phút

    //Lấy thông tin sử dụng bộ nhớ
    const memoryUsage = process.memoryUsage();

    //Tính toán tải CPU %
    const cpus = os.cpus();
    const cpuPercentage = (cpuLoad[0] / cpus.length) * 100;

    //Trả về kết quả
    res.status(200).json({
      status: "OK",
      database: "Connected",
      cpuLoad: {
        "1min": cpuLoad[0],
        "5min": cpuLoad[1],
        "15min": cpuLoad[2],
        percentage: cpuPercentage.toFixed(2) + "%",
      },
      memoryUsage: {
        rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + " MB",
        heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + " MB",
        heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + " MB",
        external: (memoryUsage.external / 1024 / 1024).toFixed(2) + " MB",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "FAIL",
      database: "Disconnected",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("This is online shop app using NodeJS + ReactJS");
});

routes(app); // gọi đến AppRoute để đăng ký các route

const port = process?.env?.PORT ?? 3000; //nếu null thì không gọi vào Port, dùng mặc định 3000

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

