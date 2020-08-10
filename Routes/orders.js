const express = require('express');
const router = express.Router();

const Product = require('../Models/Product');
const Cart = require('../Models/Cart');
const Address = require('../Models/Address');
const Order = require('../Models/Order');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

//Fetch all orders of a user
router.get('/:userId', async (req,res,next)=>{
    const allOrders = await Order.find({User_Id: req.params.userId}).exec();
    if (allOrders[0] != null) {
        res.status(200).json({message: "Orders fetched successfully",allOrders});
    } else {
        res.status(404).json({message: "No orders found for this user"});
    }
});



//create an order
router.post('/:userId', async (req,res, next)=>{
    
    try{
        var lastId = 0;
        var lastOId = 0;
        var lastRefId = 0;
        var lastOrderId = 0;
        productsInCart = await Cart.find({User_Id: req.params.userId}).exec();
        lastRefId = await Order.find().sort({"Order_Reference_Id" : -1}).limit(1).exec();
        if (productsInCart.length > 0) {            
            let fetchedFlag = false;
            productsInCart.forEach(async p => {
                
                productsFromProdTable = await Product.find({Product_Id: p.Product_Id}).exec();
               
                if (productsFromProdTable[0] != null) {

                    if((productsFromProdTable[0].Available_Quantity - p.Quantity) >= 0){
                        var newItem;
                        console.log("LastId = "+lastId);
                        
                        if (lastId < lastRefId[0].Order_Reference_Id) {
                            lastId = lastRefId[0].Order_Reference_Id + 1;
                            lastOId = lastRefId[0].Order_Id + 1;
                            const placeOrder = new Order({
                                _id: new Mongoose.Types.ObjectId(),
                                Order_Reference_Id: lastId,
                                User_Id: req.params.userId,
                                Product_Id: p.Product_Id,
                                Cart_Id: p.Cart_Id,
                                Quantity: p.Quantity,
                                Status: "order placed",
                                Amount: productsFromProdTable[0].Price,
                                Order_Date_Time: Date.now(),
                                Order_Id: lastOId
                            });
                            try{                                
                                                newItem= await placeOrder.save();
                                                const deleteCartProduct = await Cart.deleteOne({Product_Id:p.Product_Id});                                               
                                                    productToBeUpdated = await Product.find({Product_Id:p.Product_Id});
                                                    const myQuery = {Product_Id: p.Product_Id};
                                                    const newValue = {$set:{Available_Quantity: productToBeUpdated[0].Available_Quantity - p.Quantity}};
                                                    const updatedProduct = await Product.updateOne(myQuery,newValue);                                                                                        
                                            } 
                                                catch(err)
                                                {
                                                    res.json({message: err.message});
                                                }
                        } 
                        else {
                            lastId++;
                            const placeOrder = new Order({
                                _id: new Mongoose.Types.ObjectId(),
                                Order_Reference_Id: lastId,
                                User_Id: req.params.userId,
                                Product_Id: p.Product_Id,
                                Cart_Id: p.Cart_Id,
                                Quantity: p.Quantity,
                                Status: "order placed",
                                Amount: productsFromProdTable[0].Price,
                                Order_Date_Time: Date.now(),
                                Order_Id: lastOId
                            });
                            try{
                                newItem = await placeOrder.save();
                                const deleteCartProduct = await Cart.deleteOne({Product_Id:p.Product_Id});     
                                productToBeUpdated = await Product.find({Product_Id:p.Product_Id});
                                const myQuery = {Product_Id: p.Product_Id};
                                const newValue = {$set:{Available_Quantity: productToBeUpdated[0].Available_Quantity - p.Quantity}};
                                const updatedProduct = await Product.updateOne(myQuery,newValue);
                                                     
                                                     
                                lastId++;
                                                              
                            } 
                                catch(err)
                                {
                                    res.json({message: err.message});
                                }
                        }
                        if (newItem != null) {
                            res.json({message: "Order placed Successfully"});
                        }
                        else{
                            res.json({message: "Some issue with the connection i guess"});
                        }                          
                    }
                    else{
                        res.json({message: "OOps! We do not have sufficient products available in our database to place an order. Please try again tomorrow."});
                    }
                    
                } else {
                    res.json({message: "Product Unavailable"});
                }
            
            }); 

        } else {
            res.json({message: "OOps!! You do not have any product added in your Cart"});
        }
    }
    catch(err){
        res.json({message: err.message});
    }

});



module.exports = router;