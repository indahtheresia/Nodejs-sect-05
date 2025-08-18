const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/edit-product', { title: 'Add Product', path:'/admin/add-product' });
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  res.render('admin/edit-product', { title: 'Edit Product', path:'/admin/edit-product', editing: editMode });
}

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => res.render('admin/products', { prods: products, title: 'Admin Products', path: '/admin/products' }));
}