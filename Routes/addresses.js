const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});
const Address = require('../Models/Address');
const Mongoose = require('mongoose');
const { json } = require('body-parser');

//Fetch all the Address
router.get('/', async(req, res, next) => {
    const allAddresses = await Address.find().exec();
    if (allAddresses != null) {
        res.status(200).json({ message: "All Address fetched successfully", allAddresses });
    } else {
        res.status(404).json({ message: "Address not found" });
    }
});

//Fetch a specific id based on the id. It by default checks the indexes and as there is a default indexer, it matches the parameter for that indexer
router.get('/user', async(req, res, next) => {
    try {
        const userId = req.query.User_Id;

        const requestedAddress = await Address.find({ User_Id: req.query.User_Id }).exec();

        if (requestedAddress != null) {

            res.status(200).json({ message: " Certain Usere's Addresses fetched successfully", isModified: "false", ok: "true", requestedAddress });

        } else {
            res.status(404).json({ message: "Address not found in this userId", isModified: "false", ok: "false" });
        }
    } catch (err) {
        res.json({ message: "User's address doesn't exist" });
    }
});

//Create new Address
router.post('/', async(req, res, next) => {

    const userCounts = await Address.find({ User_Id: req.body.User_Id });

    console.log(userCounts.length);

    if (userCounts.length < 2 || userCounts == null) {

        const address = new Address({
            _id: new Mongoose.Types.ObjectId(),
            Address_Id: req.body.Address_Id,
            User_Id: req.body.User_Id,
            Last_Name: req.body.Last_Name,
            First_Name: req.body.First_Name,
            Street_Address: req.body.Street_Address,
            PostCode: req.body.PostCode,
            City: req.body.City,
            Phone_Number: req.body.Phone_Number
        });
        try {
            const newAddress = await address.save();
            if (newAddress != null) {
                res.status(200).json({ message: "Address Added Successfully", newAddress });
            } else {
                res.status(400).json({ message: "Some issue with the connection i guess" });
            }

        } catch (err) {
            res.json({ message: err.message });
        }
    } else {
        res.json({ message: "Each user only can add 2 addresses" });
    }
})

//Update the address details
router.put('/:AddressId', async(req, res, next) => {
    try {
        const addressId = req.params.AddressId;
        const requestedAddress = await Address.findById(addressId).exec();

        if (requestedAddress != null) {
            requestedAddress.Address_Id = req.body.Address_Id;
            requestedAddress.User_Id = req.body.User_Id;
            requestedAddress.Last_Name = req.body.Last_Name;
            requestedAddress.First_Name = req.body.First_Name;
            requestedAddress.Street_Address = req.body.Street_Address;
            requestedAddress.PostCode = req.body.PostCode;
            requestedAddress.City = req.body.City;
            requestedAddress.Phone_Number = req.body.Phone_Number;
            requestedAddress.save();
            res.status(200).json({ message: "Update Successfully", requestedAddress });
        } else {
            res.status(400).json({ message: "Address ID doesn't exist" });
        }
    } catch (err) { res.json({ message: "Wrong format of input" }); }

})

//Delete Address by Address_Id
router.delete('/:addressId', async(req, res, next) => {
    try {
        let userAddress = new Address();
        const checkUserAddress = await Address.findOne({ _id: req.params.addressId });

        if (checkUserAddress != null) {
            const deletedAddress = await Address.deleteOne({ _id: req.params.addressId });
            res.status(200).json({ message: "Delete successfully", });
        } else {
            res.status(404).json({ message: "Can't found the Address Id to delete", });
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});
module.exports = router;