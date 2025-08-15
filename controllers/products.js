const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', { title: 'Add Product', path:'/admin/add-product', formsCSS: true, productCSS: true, addProductActive: true });
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => res.render('shop', { prods: products, title: 'Shop', path: '/', hasProducts: products.length > 0, productCSS: true, shopActive: true }));
  ;
}