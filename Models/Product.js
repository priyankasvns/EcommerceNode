const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Product_Id: {
        type: Number,
        required: true
    },
    Size: 
    {
        type: String,
        required: true
    },
    Color: 
    {
        type: String,
        required:true
    },
    Name: {
        type: String,
        require:true
    },
    Description: 
    {
        type: String,
        required: true
    },
    Price: 
    {
        type: Number,
        required: true
    },
    Available_Quantity: 
    {
        type: Number,
        required: true
    },
    Picture: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Products', ProductSchema);