const validationResult = require('express-validator').validationResult;

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('admin/edit-product', { title: 'Add Product', path:'/admin/add-product', editing: false, hasError: false, errorMessage: null, validationErrors: [] });
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { title: 'Add Product', path:'/admin/add-product', editing: false, hasError: true, product: {
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description
    }, errorMessage: errors.array()[0].msg, validationErrors: errors.array() });
  }

  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
  
  product.save().then(result => {
    console.log('Product Created!');
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // Product.findByPk(prodId)
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', { title: 'Edit Product', path:'/admin/edit-product', editing: editMode, product: product, hasError: false, errorMessage: null, validationErrors: [] });
  }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { title: 'Edit Product', path:'/admin/edit-product', editing: true, hasError: true, product: {
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
      _id: prodId
    }, errorMessage: errors.array()[0].msg, validationErrors: errors.array() });
  }
  Product.findById(prodId).then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save().then(result => {
      console.log('Product Edited');
      res.redirect('/admin/products');
    })
  })
  .catch(err => console.log(err));
}

exports.getAdminProducts = (req, res, next) => {
  // Product.findAll()
  Product.find({userId: req.user._id})
  .then(products => {
    res.render('admin/products', { prods: products, title: 'Admin Products', path: '/admin/products', isAuthenticated: req.session.isLoggedIn })
  }).catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id }).then(() => {
    console.log('Product Deleted!');
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
}