const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);

const page404Controllers = require('./controllers/404');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(page404Controllers.get404);

app.listen(3000);
