const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    }
});

const removePicture = multer({
    dest: 'uploads/'
});
const upload = multer({
    storage: storage
});

const fileFilter = (req, file, cb) => {
    //reject a file if the type doesn't match
    if (file.mimetype === 'image/JPEG' || file.mimetype === 'image/PNG') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const Order = require('../Models/Order');
const Comment = require('../Models/Comment');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

//Fetch all the Comments from DB
router.get('/', async(req, res, next) => {
    const allComments = await Comment.find().exec();
    if (allComments != null) {
        res.status(200).json({ message: "All Comments fetched successfully", allComments });
    } else {
        res.status(404).json({ message: "Comments not found" });
    }
});

//Fetch a specific Comment based on the id. It by default checks the indexes and as there is a default indexer, it matches the parameter for that indexer
router.get('/getComment', async(req, res, next) => {
    try {
        const requestedComment = await Comment.find({ Product_Id: req.query.Product_Id }).exec();

        if (requestedComment[0] != null) {
            res.status(200).json({ message: "Certain Product's Comments fetched successfully", requestedComment });
        } else {
            res.status(404).json({ message: "Did not found the comment in this product" });
        }
    } catch (err) {
        res.status(404).json({ message: "Enter the wrong Product ID" });
    }
});

//Create new Comment
router.post('/createComment', upload.single('Comment_Image'), async(req, res, next) => {
    try {
        const purchasingCheck = await Order.find({ User_Id: req.body.User_Id, Product_Id: req.body.Product_Id });

        if (purchasingCheck[0] != null) {

            const checkComment = await Comment.find({ User_Id: req.body.User_Id, Product_Id: req.body.Product_Id });

            if (checkComment[0] == null) {
                //Fetching the latest comment id
                const latestComment = await Comment.find().sort({ 'Comment_Id': -1 }).limit(1);
                //Appending the comment id to create a new comment id
                const newCommentId = latestComment[0].Product_Id + 1;
                const comment = new Comment({
                    _id: new Mongoose.Types.ObjectId(),
                    Comment_Id: newCommentId,
                    Product_Id: req.body.Product_Id,
                    User_Id: req.body.User_Id,
                    Content: req.body.Content,
                    Modified_Date: Date.now(),
                    Created_Date: Date.now(),
                    Comment_Image: req.file.path
                });
                try {
                    const newComment = await comment.save();
                    if (newComment != null) {
                        res.json({ message: "Comment Added Successfully", newComment });
                    } else {
                        res.json({ message: "Some issue with the connection I guess" });
                    }

                } catch (err) {
                    res.json({ message: err.message });
                }
            } else {
                res.json({ message: "User already have comment at this product." });
            }
        } else {
            res.json({ message: "User didn't purchasing this product." });
        }


    } catch (err) {
        res.json({ message: "User_Id and Product_Id are not match/Invailed Input of User_Id/Product_Id" });
    }

})

//Update the Comment details
router.put('/updateComment', upload.single('Comment_Image'), async(req, res, next) => {
    try {
        const userComment = await Comment.find({ _id: req.body._id }).exec();
        if (userComment[0].User_Id == req.body.User_Id) {
            if (userComment[0] != null) {
                if (userComment[0].Created_Date != null) {
                    userComment[0].Comment_Id = userComment[0].Comment_Id;
                    userComment[0].Product_Id = userComment[0].Product_Id;
                    userComment[0].User_Id = userComment[0].User_Id;
                    userComment[0].Content = req.body.Content;
                    userComment[0].Modified_Date = Date.now();
                    userComment[0].Comment_Image = req.file.path;
                    userComment[0].save();
                } else {
                    userComment[0].Comment_Id = userComment[0].Comment_Id;
                    userComment[0].Product_Id = userComment[0].Product_Id;
                    userComment[0].User_Id = userComment[0].User_Id;
                    userComment[0].Content = req.body.Content;
                    userComment[0].Created_Date = Date.now();
                    userComment[0].Modified_Date = Date.now();
                    userComment[0].Comment_Image = req.file.path;
                    userComment[0].save();
                }
                res.status(200).json({ message: "Update Successfully", userComment });
            } else {
                res.status(404).json({ message: "   " });
            }
        } else {
            res.status(404).json({ message: "User's comment doesn't exist/Comment & User_Id are not match." });
        }
    } catch (err) { res.json({ message: "Wrong format of input" }); }

})


//Delete Comment by Comment_Id & User_Id
router.delete('/deleteComment', async(req, res, next) => {
    try {
        const checkUserComment = await Comment.find({ _id: req.body._id, User_Id: req.body.User_Id }).exec();

        if (checkUserComment[0] != null) {

            let splitString = checkUserComment[0].Comment_Image.split("\\");
            const deletedComment = await Comment.deleteOne({ _id: req.body._id });
            const path = 'uploads/' + splitString[1];

            fs.unlink(path, function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Deleted file successfully");
                }
            });

            res.status(200).json({ message: "Delete comment successfully", });

        } else {
            res.status(404).json({ message: "User's comment doesn't exist/Comment & User_Id are not match." });
        }
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

module.exports = router;