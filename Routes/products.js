const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const validator = require('email-validator');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toLocaleDateString() + file.originalname);
    }
});

const removePicture = multer({
    dest: 'uploads/'
});
const upload = multer(
    {
        storage: storage
});
const Product = require('../Models/Product');
const User = require('../Models/User');
const Mongoose = require('mongoose');
const { json } = require('body-parser');
const isAdmin = false;

const fileFilter = (req,file, cb) =>{
    //reject a file if the type doesn't match
    if(file.mimetype === 'image/JPEG' || file.mimetype === 'image/PNG'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }   
}

//Fetch all the products
router.get('/', async (req,res,next)=>{
    const allProducts = await Product.find({}).exec();
    if (allProducts != null) {
        res.status(200).json({message: "Products fetched successfully",allProducts});
    } else {
        res.status(404).json({message: "Products not found"});
    }
});

//Fetch a specific id based on the id. It by default checks the indexes and as there is a default indexer, it matches the parameter for that indexer
router.get('/:productId',async (req,res, next)=>{
    try{
    const id = req.params.productId;

    const requestedProduct = await Product.find({Product_Id: id}).exec();
    if (requestedProduct[0] != null) {
        res.status(200).json({message: "Product fetched successfully",requestedProduct});
    } else {
        res.status(404).json({message: "Product not found"});
    }
}
catch(err){
    res.json({message: err.message});
}
});

//Create new Products
router.post('/',upload.single('Picture'), async (req,res, next)=>{          
    if (validator.validate(req.body.email)) {       
        let user = new User();
        const checkUser = await User.findOne({Email: req.body.email});
        if (checkUser != null) {         
        if (checkUser.validPassword(req.body.password) && checkUser.Role === "Admin") {    
            //Fetching the latest product id
            const latestProduct = await Product.find().sort({'Product_Id':-1}).limit(1);
            //Appending the product id to create a new product id
            const newProductId = latestProduct[0].Product_Id + 1;                
            const product = new Product({
                _id: new Mongoose.Types.ObjectId(),
                 Product_Id: newProductId,
                 Size: req.body.Size,
                 Color: req.body.Color,
                 Name: req.body.Name,
                 Description: req.body.Description,
                 Price: req.body.Price,
                 Available_Quantity: req.body.Available_Quantity,
                 Picture: req.file.path
             });
             try{
             const newProduct= await product.save();
             if (newProduct != null) {
                 res.json({message: "Product Added Successfully"});
             }
             else{
                 res.json({message: "Some issue with the connection i guess"});
             }
             
             }
             catch (err){
                 res.json({message: err.message});
             }
            
        
    }
    else{
        res.json({message:"Either the password is incorrect or the user is not an admin to add a new Product"});
    }
}
    else {
            res.json({message: "The user either does not exist in the database or is not an admin"});
        }
        
    } 
    else {
        res.json({message: "This is not a valid email address. Please enter a valid email"});
    } 
    
});

router.delete('/:productId', async (req, res, next) => {
    try {
        if (validator.validate(req.body.email)) {       
        let user = new User();
        const checkUser = await User.findOne({Email: req.body.email});
        if (checkUser != null) {           
        if (checkUser.validPassword(req.body.password) && checkUser.Role === "Admin") { 
        const id = req.params.productId;
        const tobeDeletedProduct = await Product.findOne({Product_Id: id}); 
        if (tobeDeletedProduct != null) {
                      
        const deletedProduct =  await Product.deleteOne({Product_Id: id});
        let splitString = tobeDeletedProduct.Picture.split("\\");
        if (deletedProduct != null) {
            const path = 'uploads/'+ splitString[1];
            fs.unlink(path, function(err){
                if (err) {
                    throw err;
                }
                else{
                    console.log("Deleted file successfully");
                }
            });
            res.status(200).json({message: "Product deleted successfully",deletedProduct});
        } else {
            res.status(404).json({message: "Product not found",deletedProduct});
        }
    }
    else{
        res.status(404).json({message: "Product not found"});
    }
    } 
    else{
        res.json({message:"Either the password is incorrect or the user is not an admin to delete a new Product"});
    }
}
    else {
            res.json({message: "The user either does not exist in the database or is not an admin"});
        }
        
    } 
    else {
        res.json({message: "This is not a valid email address. Please enter a valid email"});
    }
} 
    catch (err) {
        res.json({message: err.message});
    }
});


module.exports = router;
