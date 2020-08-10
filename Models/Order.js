const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Order_Reference_Id: 
    {
        type: Number,
        required: true
    },
    User_Id: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Product_Id: 
    {
        type: Number,
        required:true
    },
    Cart_Id: {
        type: Number,
        require:true
    },
    Quantity: 
    {
        type: Number,
        required: true
    },
    Status: 
    {
        type: String,
        required: true
    },
    Amount: 
    {
        type: Number,
        required: true
    },
    Order_Date_Time: 
    {
        type: Date,
        required: true
    },
    Order_Id: 
    {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Orders', OrdersSchema);