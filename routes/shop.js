const path = require('path');

const express = require('express');

const adminData = require('./admin');

const rootDir = require('../util/path');

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.product;
  res.render('shop', { prods: products, title: 'Shop', path: '/', hasProducts: products.length > 0 });
});

module.exports = router;