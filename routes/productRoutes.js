import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from '../controllers/productController.js';
import formidable from 'express-formidable';

//route object
const router = express.Router();

//routes

//create category
router.post(
  '/create-product',
  requireSignIn,
  createProductController
);

//update category
router.put(
  '/update-product/:slug',
  requireSignIn,
  isAdmin,
  updateProductController
);

//get all category
router.get('/get-product', getProductController);

//get single category
router.get('/single-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:slug', productPhotoController);

//delete category
router.delete(
  '/delete-product/:slug',
  // requireSignIn,
  // isAdmin,
  deleteProductController
);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

export default router;
