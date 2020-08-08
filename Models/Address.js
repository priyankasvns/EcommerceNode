const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Address_Id: {
        type: Number,
        required: true
    },
    User_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    First_Name: {
        type: String,
        require: true
    },
    Street_Address: {
        type: String,
        required: true
    },
    PostCode: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Phone_Number: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('addresses', AddressSchema);