const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//import routes
const productsRoute = require('./Routes/products');
const cartRoute = require('./Routes/cart');
const ordersRoute = require('./Routes/orders');

//Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', ordersRoute);

//Connect To DB
mongoose.connect(process.env.DB_CONNECTION,
{ 
    useUnifiedTopology: true,
    useNewUrlParser: true}, 
()=> console.log('Connected to Compass'));

//Listening to server
app.listen(3000);
