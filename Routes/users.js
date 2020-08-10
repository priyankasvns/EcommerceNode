// const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
// Importing User Schema 
const User = require('../Models/User');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

// User login api 
router.post('/login', async (req, res, next) => { 
     // Find user with requested email 
     let user = new User();
     const checkUser = await User.findOne({Email: req.body.Email});
     if (checkUser != null) {
        if (checkUser.validPassword(req.body.password)) { 
            res.status(201).json({ 
                message : "User Logged In" 
            });
        } 
        else { 
            res.status(400).json({ 
                message : "Incorrect Password"
            }); 
     }
    } 
     else {
        res.status(400).json({ 
            message : "User not found."
        });
     }
    });

    // Change password
    router.patch('/Changepassword',async(req, res, next) =>{
        let user = new User();
     const checkUser = await User.findOne({Email: req.body.Email});
     if (checkUser != null) {
        if (checkUser.validPassword(req.body.password)) { 
            const query = {User_Id: checkUser.UserId}
            // const update = {$set:setPassword(req.body.NewPassword)};
            const updatePassword = await User.updateOne(query, checkUser.setPassword(req.body.NewPassword));
            if (updatePassword != null) {
                res.status(201).json({ 
                    message : "User Password Updated" 
                });
            }
            else{
                res.status(201).json({ 
                    message : "Not updated" 
                });
            }
            
        } 
        else { 
            res.status(400).json({ 
                message : "Incorrect Password"
            }); 
     }
    } 
     else {
        res.status(400).json({ 
            message : "User not found."
        });
     }
    })

      
   
// User signup api 
router.post('/signup', async (req, res, next) => { 
     
    // Creating empty user object 
       let newUser = new User(); 
     
       // Initialize newUser object with request data
       newUser._id = new Mongoose.Types.ObjectId,
       newUser.Name = req.body.Name,
       newUser.Email = req.body.Email,
       newUser.UserId = req.body.UserId,
       newUser.DateOfBirth = req.body.DateOfBirth,
       newUser.Phone = req.body.Phone,
       newUser.DateJoined = Date.now(),
       newUser.UpdatedDate = Date.now(),
       newUser.Activated = req.body.Activated,
       newUser.Role = req.body.Role,            
     
         // Call setPassword function to hash password 
         newUser.setPassword(req.body.password); 
     
       // Save newUser object to database 
       const savedUser = await newUser.save();
       if (savedUser != null) {
           res.json({message: "User added successfully", savedUser});
       } else {
        res.json({message: "User could not be added successfully"});
       }
       
   }); 
   
module.exports = router;
