const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.get("/products", isAuth, adminController.getAdminProducts);

module.exports = router;