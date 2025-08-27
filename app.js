const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);

const page404Controllers = require('./controllers/404');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('68af1a28dd2c3928a3974eb4').then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(page404Controllers.get404);

mongoose.connect(process.env.MONGODB_URL).then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({name: 'Indah', email: 'indah@gmail.com', cart: {items: []}});
      user.save();
    }
  })
  app.listen(3000);
}).catch(err => console.log(err));
