const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);

const page404Controllers = require('./controllers/404');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(page404Controllers.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize.sync().then(result => {
  // console.log(result);
  return User.findByPk(1);
}).then(user =>{
  if (!user) {
    return User.create({name: 'Indah', email:'indah@email.com'});
  }
  return user
}).then(result => app.listen(3000)).catch(err => console.log(err));

