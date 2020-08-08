const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//import routes
const productsRoute = require('./Routes/products');
<<<<<<< HEAD
const addressesRoute = require('./Routes/addresses');

=======
const usersRoute = require('./Routes/users');
>>>>>>> 6b30dafa67613edd4a28e75266e45541851bceb0
//Middlewares
app.use(cors())
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));
app.use('/api/products', productsRoute);
<<<<<<< HEAD
app.use('/api/addresses', addressesRoute);
=======
app.use('/api/users', usersRoute);
>>>>>>> 6b30dafa67613edd4a28e75266e45541851bceb0


//Connect To DB
mongoose.connect(process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log('Connected to Compass'));

//Listening to server
app.listen(3000);