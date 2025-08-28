const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title price -_id') // exclude id
  // .populate('userId', 'name')
  .then(products => {
    res.render('shop/product-list', { prods: products, title: 'Products', path: '/products' })
  }).catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({where: {id: prodId}}).then(products => {
  //   res.render('shop/product-detail', { product: products[0], title: products[0].title, path: '/products' })
  // }).catch(err => console.log(err));
  Product.findById(prodId).then((product) => {
    res.render('shop/product-detail', { product: product, title: product.title, path: '/products' })
  }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/index', { prods: products, title: 'Shop', path: '/' })
  }).catch(err =>  console.log(err));
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId').then(user => {
    const products = user.cart.items;
      res.render('shop/cart', { title:'Cart', path:'/cart', products: products })
    }).catch(err => console.log(err));
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(prod => prod.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //   })
  // })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    console.log(result);
    res.redirect('/cart');
  }).catch(err => console.log(err));
  // let fetchedCart;
  // let newQuantity = 1
  // req.user.getCart().then(cart => {
  //   fetchedCart = cart;
  //   return cart.getProducts({where: {id:prodId}});
  // }).then(products => {
  //   let product;
  //   if (products.length > 0) {
  //     product = products[0];
  //   }
  //   if (product) {
  //     const oldQuantity = product.cartItem.quantity;
  //     newQuantity = oldQuantity + 1;
  //     return product
  //   }
  //   return Product.findByPk(prodId)
  // }).then(product => {
  //   console.log(newQuantity);
  //   return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
  // }).then(() => res.redirect('/cart')).catch(err => console.log(err));
}

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user.deleteItemFromCart(prodId)
//   .then(result => res.redirect('/cart'))
//   .catch(err => console.log(err));
// }

// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', { title:'Checkout', path:'/checkout' });
// // }

// exports.postOrder = (req, res, next) => {
//   req.user.addOrder()
//   .then(result => res.redirect('/orders')).catch(err => console.log(err));
// }

// exports.getOrders = (req, res, next) => {
//   req.user.getOrders()
//   .then(orders => {
//     res.render('shop/orders', { title:'Your Orders', path:'/orders', orders: orders });
//   })
//   .catch(err => console.log(err));
// }