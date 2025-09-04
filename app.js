const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const csrfProtection = csrf();

require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);

const pageErrorControllers = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then(user => {
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  }).catch(err => {
    throw new Error(err);
  });
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

// app.use((req, res, next) => {
//   if (req.session && req.session.user) {
//     req.session.user = new User(req.session.user);
//   }
//   next();
// })

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', pageErrorControllers.get500);
app.use(pageErrorControllers.get404);

mongoose.connect(process.env.MONGODB_URL).then(result => {
  app.listen(3000);
}).catch(err => console.log(err));
