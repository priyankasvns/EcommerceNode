const express = require('express');
const router = express.Router();

const Product = require('../Models/Product');
const Cart = require('../Models/Cart');
const Address = require('../Models/Address');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

var requestedProduct;
var addrId;

router.get('/:userId', async (req,res, next)=>{
    
    try{
        allProductsInCart = await Cart.find({User_Id: req.params.userId}).exec();
        if (allProductsInCart != null) 
        {
            res.status(200).json({message: "Products list in your Cart are fetched",allProductsInCart});
        } 
        else 
        {
            res.status(404).json({message: "No Products are found in your cart"});
        }
    }
    catch(err)
    {
        res.json({message: err.message});
    }
});

//Add Products to cart
router.post('/:userId', async (req,res, next)=>{
    
    var availQuantity = false;
    try{
        const prodId = req.body.Product_Id;
        requestedProduct = await Product.find({Product_Id: prodId}).exec();
        if (requestedProduct[0] != null) {
            if(requestedProduct[0].Available_Quantity > 0){
                availQuantity = true;
            }
            
        } else {
            availQuantity = false;
        }
    }
    catch(err){
        res.json({message: err.message});
    }

    var addrIdFetched = false;
    try{
        const usrId = req.params.userId;
        addrId = await Address.find({User_Id: req.params.userId}).exec();
        if (addrId[0] != null){
            addrIdFetched = true;
        }
        else{
            addrIdFetched = false;
        }
    }
    catch(err){
        res.json({message: err.message});
    }

    var lastCartId;
    var lastIdFetched;

    try{
        lastCartId = await Cart.find().sort({"Cart_Id" : -1}).limit(1).exec();
        if (lastCartId[0] != null){
            //console.log('last id true' + lastCartId[0].Cart_Id);
            lastIdFetched = true;
        }
        else{
            lastIdFetched = false;
        }
    }
    catch(err){
        res.json({message: err.message});
    }

    var prodAlreadyExistsInCart;
    var prodExists = false;
    try
    {
        prodAlreadyExistsInCart = await Cart.find({User_Id: req.params.userId, Product_Id: req.body.Product_Id}).exec();
        if (prodAlreadyExistsInCart[0] != null){
            prodExists = true;
        }
        else{
            prodExists = false;
        }
    }
    catch(err)
    {
        res.json({message: err.message});
    }

    if(prodExists == false)
    {
        if(addrIdFetched == true && availQuantity == true && lastIdFetched == true)
    {
        const addProdToCart = new Cart({
            _id: new Mongoose.Types.ObjectId(),
             Cart_Id: lastCartId[0].Cart_Id + 1,
             Product_Id: requestedProduct[0].Product_Id,
             User_Id: req.params.userId,
             Address_Id: addrId[0].Address_Id,
             Quantity: req.body.Quantity,
             Time_Added: Date.now()
         });
         try{
            const newItem= await addProdToCart.save();
            if (newItem != null) {
                 res.json({message: "Product Added to Cart Successfully",newItem});
            }
            else{
                 res.json({message: "Some issue with the connection i guess"});
            }
         
         }
         catch (err){
             res.json({message: err.message});
         }
    }
    }

    else if(prodExists == true)
    {
        try{
            newQuantity = parseInt(prodAlreadyExistsInCart[0].Quantity) + parseInt(req.body.Quantity);
            const myQuery = {Product_Id: req.body.Product_Id, User_Id: req.params.userId};
            const newValue = {$set:{Quantity: newQuantity}};
            const updatedPost = await Cart.findOneAndUpdate(myQuery, newValue);
            res.json(updatedPost);
        }
        catch(err){
            res.json({message: err});
        }
    }
       
});


//Delete products from cart
router.delete('/:usrId', async (req, res, next) => {
    try {
        const uId = req.params.usrId;
        var newQuantity;

        try{
            requestedCartProduct = await Cart.find({Product_Id: req.body.Product_Id, User_Id: uId}).exec();

            if (requestedCartProduct[0] != null) {
                if(requestedCartProduct[0].Quantity > 1)
                {
                    try{
                        newQuantity = requestedCartProduct[0].Quantity - 1;
                        const myQuery = {Product_Id: req.body.Product_Id, User_Id: uId};
                        const newValue = {$set:{Quantity: newQuantity}};
                        const updatedPost = await Cart.findOneAndUpdate(myQuery, newValue);
                        res.json(updatedPost);
                    }
                    catch(err){
                        res.json({message: err});
                    }
                    
                }
                else if(requestedCartProduct[0].Quantity == 1)
                {
                    const deletedProduct =  await Cart.remove({Product_Id: req.body.Product_Id, User_Id: uId});
                    if (deletedProduct != null) {
                        res.status(200).json({message: "Product deleted from cart successfully",deletedProduct});
                    } else {
                        res.status(404).json({message: "Product not found in the cart",deletedProduct});
                    }            
                }
                else
                {
                    res.status(404).json({message: "Product not found in the cart"});
                }
            }
        }
        catch(err){
            res.json({message: err.message});
        }



        
    } catch (err) {
        res.json({message: err.message});
    }
});


module.exports = router;
