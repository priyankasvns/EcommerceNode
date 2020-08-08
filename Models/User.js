const mongoose = require('mongoose');
var crypto = require('crypto');
//creating user schema
const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    UserId: {
        type: Number,
        required: true
    },
    Email: 
    {
        type: String,
        required: true
    },
    Name: 
    {
        type: String,
        required:true
    },
    DateOfBirth: {
        type: Date,
        required:true
    },
    Phone: 
    {
        type: String,
        required: true
    },
    DateJoined: 
    {
        type: Date,
        required: false
    },
    UpdatedDate: 
    {
        type: Date,
        required: false
    },
    Activated: {
        type: Boolean,
        required: true
    },
        hash: String,
        salt: String,      
   

});
UserSchema.methods.setPassword = function(password) { 
// Creating a unique salt for a particular user 
this.salt = crypto.randomBytes(16).toString('hex'); 
  
// Hashing user's salt and password with 1000 iterations, 64 length and sha512 digest 
this.hash = crypto.pbkdf2Sync(password, this.salt,
     1000, 64, `sha512`).toString(`hex`); 
};
// Method to check the entered password is correct or not 
UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 
 
  // validate User
  function validateUser(user) {
    const schema = {
        Name: mongoose.string().required(),
        Email: mongoose.string().required().email(),
        password: mongoose.string().required()
    };
    return mongoose.validate(user, schema);
};
// Exporting module to allow it to be imported in other files 
const User = module.exports = mongoose.model('User', UserSchema); 
exports.User = User;
exports.validate = validateUser;


