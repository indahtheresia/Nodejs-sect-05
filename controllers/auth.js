const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validationResult = require('express-validator').validationResult;

const User = require('../models/user');
const transporter = require('../util/send-mail');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].split('=')[1];
  const errorMsg = req.flash('error');
  let message;
  if (errorMsg.length > 0) {
    message = errorMsg[0];
  } else {
    message = null;
  }
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
  res.render('auth/signup', { title: 'Signup', path: '/signup', errorMessage: message });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', { title: 'Signup', path: '/signup', errorMessage: errors.array()[0].msg })
  }
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] }
    })
    return user.save();
    })
    .then(result => {
      let mailOps = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Signup succeeded!',
        text: 'You successfully signed up!'
      };
      transporter.sendMail(mailOps, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
      res.redirect('/login')
    })
  .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
}

exports.getResetPassword = (req, res, next) => {
  const errorMsg = req.flash('error');
  let message;
  if (errorMsg.length > 0) {
    message = errorMsg[0];
  } else {
    message = null;
  }
  res.render('auth/reset', { title: 'Reset Password', path: '/reset', errorMessage: message });
}

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      let mailOps = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset a new password</p>
          `
        };
        transporter.sendMail(mailOps, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        })
    })
    .catch(err => console.log(err));
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now() }})
  .then(user => {
    const errorMsg = req.flash('error');
    let message;
    if (errorMsg.length > 0) {
      message = errorMsg[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', { title: 'New Password', path: '/new-password', errorMessage: message, userId: user._id.toString(), resetToken: token });
  })
  .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
  const resetToken = req.body.resetToken;
  const password = req.body.password;
  const userId = req.body.userId;
  let resetUser;
  User.findOne({ resetToken: resetToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(password, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
  })
}