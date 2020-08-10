const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Comment_Id: {
        type: Number,
        required: true
    },
    Product_Id: {
        type: Number,
        required: true
    },
    User_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Content: {
        type: String,
        require: true
    },
    Created_Date: {
        type: Date,
        required: false
    },
    Modified_Date: {
        type: Date,
        required: false
    },
    Comment_Image: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Comments', CommentSchema);