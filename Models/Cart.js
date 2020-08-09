const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Cart_Id: 
    {
        type: Number,
        required: true
    },
    Product_Id: 
    {
        type: Number,
        required: true
    },
    User_Id: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    Address_Id: {
        type: Number,
        require:false
    },
    Quantity: 
    {
        type: Number,
        required: true
    },
    Time_Added: 
    {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Cart', CartSchema);