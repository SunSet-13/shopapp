import express from "express";
const router = express.Router();

import * as ProductController from "../controllers/ProductController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as BrandController from "../controllers/BrandController.js";
import * as OrderController from "../controllers/OrderController.js";
import * as OrderDetailController from "../controllers/OrderDetailController.js";
import * as UserController from "../controllers/UserController.js"
import * as NewsController from "../controllers/NewsController.js"
import * as NewsDetailController from "../controllers/NewsDetailController.js"

import asyncHandler from "../middlewares/asyncHandler.js";
import validate from "../middlewares/validate.js";
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest.js";
import UpdateProductRequest from "../dtos/requests/product/UpdateProductRequest.js";
import InsertOderRequest from "../dtos/requests/order/InsertOderRequest.js";
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest.js";
import InsertNewsRequest from "../dtos/requests/news/InsertNewsRequest.js";
import InsertNewsDetailRequest from "../dtos/requests/newsdetail/InsertNewsDetailRequest.js";

export function routes(app) {
  //news
  router.get("/news", asyncHandler(NewsController.getNewsArticle));
router.get("/news/:id", asyncHandler(NewsController.getNewsArticleById));
router.post("/news", 
  validate(InsertNewsRequest), 
  asyncHandler(NewsController.insertNewsArticle));
router.put("/news/:id", 
  //validate(UpdateNewsRequest), 
  asyncHandler(NewsController.updateNewsArticle));
router.delete("/news/:id", asyncHandler(NewsController.deleteNewsArticle));
  //Users
  router.post("/users",
    validate(InsertUserRequest), 
    asyncHandler(UserController.insertUser)
  );

  // Products
  router.get("/products", asyncHandler(ProductController.getProduct));
  router.get("/products/:id", asyncHandler(ProductController.getProductById));
  router.post("/products",
    validate(InsertProductRequest), 
    asyncHandler(ProductController.insertProduct)
  );
  router.delete("/products/:id", asyncHandler(ProductController.deleteProduct));
  router.put("/products/:id", 
    validate(UpdateProductRequest),
    asyncHandler(ProductController.updateProduct));

  // Categories
  router.get("/categories", asyncHandler(CategoryController.getCategory));
  router.get("/categories/:id", asyncHandler(CategoryController.getCategoryById));
  router.post("/categories", asyncHandler(CategoryController.insertCategory));
  router.delete("/categories/:id", asyncHandler(CategoryController.deleteCategory));
  router.put("/categories/:id", asyncHandler(CategoryController.updateCategory));

  // Brands
  router.get("/brands", asyncHandler(BrandController.getBrand));
  router.get("/brands/:id", asyncHandler(BrandController.getBrandById));
  router.post("/brands", asyncHandler(BrandController.insertBrand));
  router.delete("/brands/:id", asyncHandler(BrandController.deleteBrand));
  router.put("/brands/:id", asyncHandler(BrandController.updateBrand));

  // Orders
  router.get("/orders", asyncHandler(OrderController.getOrder));
  router.get("/orders/:id", asyncHandler(OrderController.getOrderById));
  router.post("/orders",
    validate(InsertOderRequest),
    asyncHandler(OrderController.insertOrder));
  router.delete("/orders/:id", asyncHandler(OrderController.deleteOrder));
  router.put("/orders/:id", asyncHandler(OrderController.updateOrder));

  // Order Details
  router.get("/order-details", asyncHandler(OrderDetailController.getOrderDetail));
  router.get("/order-details/:id", asyncHandler(OrderDetailController.getOrderDetailById));
  router.post("/order-details", asyncHandler(OrderDetailController.insertOrderDetail));
  router.delete("/order-details/:id", asyncHandler(OrderDetailController.deleteOrderDetail));
  router.put("/order-details/:id", asyncHandler(OrderDetailController.updateOrderDetail));

  //news_details

  router.get("/news-details", asyncHandler(NewsDetailController.getNewsDetails));
router.get("/news-details/:id", asyncHandler(NewsDetailController.getNewsDetailById));
router.post(
  "/news-details",
   validate(InsertNewsDetailRequest),
  asyncHandler(NewsDetailController.insertNewsDetail)
);
router.delete("/news-details/:id", asyncHandler(NewsDetailController.deleteNewsDetail));
router.put(
  "/news-details/:id",
  // validate(UpdateNewsDetailRequest),
  asyncHandler(NewsDetailController.updateNewsDetail)
);

  // Mount the router to /api
  app.use("/api", router);
}
