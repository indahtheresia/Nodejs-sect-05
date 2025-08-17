const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => res.render('shop/product-list', { prods: products, title: 'Products', path: '/products' }));
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => res.render('shop/product-detail', { product: product, title: product.title, path: '/products' })
  );
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => res.render('shop/index', { prods: products, title: 'Shop', path: '/' }));
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', { title:'Cart', path:'/cart' });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { title:'Your Orders', path:'/orders' });
}


exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { title:'Checkout', path:'/checkout' });
}