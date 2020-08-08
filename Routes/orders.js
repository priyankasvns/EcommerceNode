const express = require('express');
const router = express.Router();

const Product = require('../Models/Product');
const Cart = require('../Models/Cart');
const Address = require('../Models/Address');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

//create an order
router.post('/:userId', async (req,res, next)=>{
    
    try{
        var lastId;
        productsInCart = await Cart.find({User_Id: req.params.userId}).exec();
        if (productsInCart != null) {
            productsInCart.forEach(async p => {
                //console.log(p.Product_Id);
                productsFromProdTable = await Product.find({Product_Id: p.Product_Id}).exec();
                //console.log(productsFromProdTable);
                if (productsFromProdTable[0] != null) {
                    if(productsFromProdTable[0].Available_Quantity - p.Available_Quantity > 0){
                        console.log('place order');
                        lastRefId = await Order.find().sort({"Order_Reference_Id" : -1}).limit(1).exec();
                        if (lastRefId != null){
                            lastId = lastRefId;
                            
                        }
                        else{
                            lastId = 1;
                        }
                        console.log(lastId);

                        
                        

                    }
                    
                } else {
                    console.log('false');
                    //availQuantity = false;
                }
                
            });   
        } else {
            
        }
    }
    catch(err){
        res.json({message: err.message});
    }

});



module.exports = router;