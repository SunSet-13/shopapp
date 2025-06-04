import express from 'express';
const router = express.Router();
import * as ProductController from './controllers/ProductController.js';
import * as CategoryController from './controllers/CategoryController.js';
import * as BrandController from './controllers/BrandController.js';
import * as OrderController from './controllers/OrderController.js';
import * as OrderDetailController from './controllers/OrderDetailController.js';

export function AppRoute(app) {
    //http://localhost:3000/api/products
    router.get('/products', ProductController.getProduct);
    router.get('/products/:id', ProductController.getProductById);
    router.post('/products', ProductController.insertProduct);
    router.delete('/products/:id', ProductController.deleteProduct);
    router.put('/products/:id', ProductController.updateProduct);

    //http://localhost:3000/api/categories
    router.get('/categories', CategoryController.getCategory);
    router.get('/categories/:id', CategoryController.getCategoryById);
    router.post('/categories', CategoryController.insertCategory);
    router.delete('/categories/:id', CategoryController.deleteCategory);
    router.put('/categories/:id', CategoryController.updateCategory);

    // Brands
router.get('/brands', BrandController.getBrand);
router.get('/brands/:id', BrandController.getBrandById);
router.post('/brands', BrandController.insertBrand);
router.delete('/brands/:id', BrandController.deleteBrand);
router.put('/brands/:id', BrandController.updateBrand);

// Orders
router.get('/orders', OrderController.getOrder);
router.get('/orders/:id', OrderController.getOrderById);
router.post('/orders', OrderController.insertOrder);
router.delete('/orders/:id', OrderController.deleteOrder);
router.put('/orders/:id', OrderController.updateOrder);

// Order Details
router.get('/order-details', OrderDetailController.getOrderDetail);
router.get('/order-details/:id', OrderDetailController.getOrderDetailById);
router.post('/order-details', OrderDetailController.insertOrderDetail);
router.delete('/order-details/:id', OrderDetailController.deleteOrderDetail);
router.put('/order-details/:id', OrderDetailController.updateOrderDetail);


    app.use('/api',router);// đăng ký router với Express
}