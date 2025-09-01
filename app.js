const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);

const page404Controllers = require('./controllers/404');
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

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err));
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

app.use(page404Controllers.get404);

mongoose.connect(process.env.MONGODB_URL).then(result => {
  app.listen(3000);
}).catch(err => console.log(err));
