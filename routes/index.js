import express from "express";
const router = express.Router();

import * as ProductController from "../controllers/ProductController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as BrandController from "../controllers/BrandController.js";
import * as OrderController from "../controllers/OrderController.js";
import * as OrderDetailController from "../controllers/OrderDetailController.js";
import * as UserController from "../controllers/UserController.js";
import * as NewsController from "../controllers/NewsController.js";
import * as NewsDetailController from "../controllers/NewsDetailController.js";
import * as BannerController from "../controllers/BannerController.js";
import * as BannerDetailController from "../controllers/BannerDetailController.js";
import imageGoogleUpload from "../middlewares/imageGoogleUpload.js";
import * as ImageController from "../controllers/ImageController.js";

import asyncHandler from "../middlewares/asyncHandler.js";
import validate from "../middlewares/validate.js";
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest.js";
import UpdateProductRequest from "../dtos/requests/product/UpdateProductRequest.js";
import InsertOderRequest from "../dtos/requests/order/InsertOderRequest.js";
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest.js";
import InsertNewsRequest from "../dtos/requests/news/InsertNewsRequest.js";
import InsertNewsDetailRequest from "../dtos/requests/newsdetail/InsertNewsDetailRequest.js";
import UpdateNewsRequest from "../dtos/requests/news/UpdateNewRequest.js";
import InsertBannerRequest from "../dtos/requests/banners/InsertBannerRequest.js";
import InsertBannerDetailRequest from "../dtos/requests/banner_detail/InsertBannerDetailRequest.js";
import uploadImagesMiddleware from "../middlewares/uploadImagesMiddleware.js";
import validateImageExists from "../middlewares/validateImageExists.js";

export function routes(app) {
  //news
  router.get("/news", asyncHandler(NewsController.getNewsArticle));
  router.get("/news/:id", asyncHandler(NewsController.getNewsArticleById));
  router.post(
    "/news",
    validate(InsertNewsRequest),
    validateImageExists,
    asyncHandler(NewsController.insertNewsArticle)
  );
  router.put(
    "/news/:id",
    validate(UpdateNewsRequest),
    validateImageExists,
    asyncHandler(NewsController.updateNewsArticle)
  );
  router.delete("/news/:id", asyncHandler(NewsController.deleteNewsArticle));
  //Users
  router.post(
    "/users",
    validate(InsertUserRequest),
    asyncHandler(UserController.insertUser)
  );

  // Products
  router.get("/products", asyncHandler(ProductController.getProduct));
  router.get("/products/:id", asyncHandler(ProductController.getProductById));
  router.post(
    "/products",
    validate(InsertProductRequest),
    validateImageExists,
    asyncHandler(ProductController.insertProduct)
  );
  router.delete("/products/:id", asyncHandler(ProductController.deleteProduct));
  router.put(
    "/products/:id",
    validate(UpdateProductRequest),
    validateImageExists,
    asyncHandler(ProductController.updateProduct)
  );

  // Categories
  router.get("/categories", asyncHandler(CategoryController.getCategory));
  router.get(
    "/categories/:id",
    asyncHandler(CategoryController.getCategoryById)
  );
  router.post("/categories",
    validateImageExists,
    asyncHandler(CategoryController.insertCategory));
  router.delete(
    "/categories/:id",
    asyncHandler(CategoryController.deleteCategory)
  );
  router.put(
    "/categories/:id",
    validateImageExists,
    asyncHandler(CategoryController.updateCategory)
  );

  // Brands
  router.get("/brands", asyncHandler(BrandController.getBrand));
  router.get("/brands/:id", asyncHandler(BrandController.getBrandById));
  router.post(
    "/brands",
    validateImageExists,
    asyncHandler(BrandController.insertBrand)
  );
  router.delete("/brands/:id", asyncHandler(BrandController.deleteBrand));
  router.put(
    "/brands/:id",
    validateImageExists,
    asyncHandler(BrandController.updateBrand)
  );

  // Orders
  router.get("/orders", asyncHandler(OrderController.getOrder));
  router.get("/orders/:id", asyncHandler(OrderController.getOrderById));
  router.post(
    "/orders",
    validate(InsertOderRequest),
    asyncHandler(OrderController.insertOrder)
  );
  router.delete("/orders/:id", asyncHandler(OrderController.deleteOrder));
  router.put("/orders/:id", asyncHandler(OrderController.updateOrder));

  // Order Details
  router.get(
    "/order-details",
    asyncHandler(OrderDetailController.getOrderDetail)
  );
  router.get(
    "/order-details/:id",
    asyncHandler(OrderDetailController.getOrderDetailById)
  );
  router.post(
    "/order-details",
    asyncHandler(OrderDetailController.insertOrderDetail)
  );
  router.delete(
    "/order-details/:id",
    asyncHandler(OrderDetailController.deleteOrderDetail)
  );
  router.put(
    "/order-details/:id",
    asyncHandler(OrderDetailController.updateOrderDetail)
  );

  //news_details

  router.get(
    "/news-details",
    asyncHandler(NewsDetailController.getNewsDetails)
  );
  router.get(
    "/news-details/:id",
    asyncHandler(NewsDetailController.getNewsDetailById)
  );
  router.post(
    "/news-details",
    validate(InsertNewsDetailRequest),
    asyncHandler(NewsDetailController.insertNewsDetail)
  );
  router.delete(
    "/news-details/:id",
    asyncHandler(NewsDetailController.deleteNewsDetail)
  );
  router.put(
    "/news-details/:id",
    // validate(UpdateNewsDetailRequest),
    asyncHandler(NewsDetailController.updateNewsDetail)
  );

  //Banner
  router.get("/banners", asyncHandler(BannerController.getBannerList));
  router.get("/banners/:id", asyncHandler(BannerController.getBannerById));
  router.post(
    "/banners",
    validate(InsertBannerRequest),
    validateImageExists,
    asyncHandler(BannerController.insertBanner)
  );
  router.delete("/banners/:id", asyncHandler(BannerController.deleteBanner));
  router.put(
    "/banners/:id",
    validateImageExists,
    asyncHandler(BannerController.updateBanner)
  );

  //BannerDetail
  router.get(
    "/banner-details",
    asyncHandler(BannerDetailController.getBannerDetail)
  );
  router.get(
    "/banner-details/:id",
    asyncHandler(BannerDetailController.getBannerDetailById)
  );
  router.post(
    "/banner-details",
    validate(InsertBannerDetailRequest),
    asyncHandler(BannerDetailController.insertBannerDetail)
  );
  router.put(
    "/banner-details/:id",
    asyncHandler(BannerDetailController.updateBannerDetail)
  );
  router.delete(
    "/banner-details/:id",
    asyncHandler(BannerDetailController.deleteBannerDetail)
  );

  //images
  router.delete("/images/delete", ImageController.deleteImage);
  router.post(
    "/images/upload",
    uploadImagesMiddleware.array("images", 5),
    asyncHandler(ImageController.uploadImages) // max 5 ảnh
  );
  router.post(
    "/images/google/upload",
    imageGoogleUpload.single("image"), // hoặc .array("images") nếu upload nhiều ảnh
    ImageController.uploadImageToGoogleStorage
  );
  router.get("/images/:fileName", asyncHandler(ImageController.viewImage));
  // Mount the router to /api
  app.use("/api", router);
}
