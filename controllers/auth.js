const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].split('=')[1];
  console.log(req.session.isLoggedIn);
  res.render('auth/login', { title: 'Login', path: '/login', isAuthenticated: req.session.isLoggedIn });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  User.findById('68af1a28dd2c3928a3974eb4').then(user => {
    req.session.user = user;
    res.redirect('/');
  }).catch(err => console.log(err));
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
}