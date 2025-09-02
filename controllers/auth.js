const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].split('=')[1];
  const errorMsg = req.flash('error');
  let message;
  if (errorMsg.length > 0) {
    message = errorMsg[0];
  } else {
    message = null;
  }
  console.log(req.session.isLoggedIn);
  res.render('auth/login', { title: 'Login', path: '/login', isAuthenticated: req.session.isLoggedIn, errorMessage: message });
};

exports.getSignup = (req, res, next) => {
  const errorMsg = req.flash('error');
  let message;
  if (errorMsg.length > 0) {
    message = errorMsg[0];
  } else {
    message = null;
  }
  res.render('auth/signup', { title: 'Signup', path: '/signup', isAuthenticated: req.session.isLoggedIn, errorMessage: message });
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email}).then(user => {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return req.session.save(err => {
        res.redirect('/login');
      }) 
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
        console.log(err);
        return res.redirect('/');
      });
      }
      req.flash('error', 'Invalid email or password');
      return req.session.save(err => {
        res.redirect('/login');
      })
    })
  }).catch(err => console.log(err));
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
  .then(userDoc => {
    if (userDoc) {
      req.flash('error', 'E-mail exists already, please pick another one');
      return req.session.save(err => {
        res.redirect('/signup');
      })
    }
    return bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save();
      })
      .then(result => {
        res.redirect('/login')
      })
  })
  .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
}