const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(
    {
        dest: 'uploads/'
});
const Product = require('../Models/Product');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

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
    const product = new Product({
       _id: new Mongoose.Types.ObjectId(),
        Product_Id: req.body.Product_Id,
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
        res.json({message: "Product Added Successfully",newProduct});
    }
    else{
        res.json({message: "Some issue with the connection i guess"});
    }
    
    }
    catch (err){
        res.json({message: err.message});
    }
    
});

router.delete('/:productId', async (req, res, next) => {
    try {
        const id = req.params.productId;
        const deletedProduct =  await Product.remove({Product_Id: id});
        if (deletedProduct != null) {
            res.status(200).json({message: "Product deleted successfully",deletedProduct});
        } else {
            res.status(404).json({message: "Product not found",deletedProduct});
        }
    } catch (err) {
        res.json({message: err.message});
    }
});

module.exports = router;
