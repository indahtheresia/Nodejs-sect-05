const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/add-product', { title: 'Add Product', path:'/admin/add-product', formsCSS: true, productCSS: true, addProductActive: true });
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => res.render('admin/products', { prods: products, title: 'Admin Products', path: '/admin/products' }));
}