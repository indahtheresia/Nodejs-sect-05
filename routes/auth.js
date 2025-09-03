const express = require('express');
const check = require('express-validator').check;
const body = require('express-validator').body;

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters.').isLength({min: 5}).isAlphanumeric()
], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email.').custom((value, {req}) => {
      return User.findOne({email: value})
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail exists already, please pick another one.');
          }
        }
      );
  }).normalizeEmail(),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters.').isLength({min: 5}).isAlphanumeric().trim(),
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords have to match!');
    }
    return true;
  })
], authController.postSignup);

router.get('/reset', authController.getResetPassword);

router.post('/reset', authController.postResetPassword);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;