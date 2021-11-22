const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30 ,    
    } ,
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:50
    } ,
    password:{
        type:String,
        minlength:8,
        maxlength:1024,
        required:true
    },
    token:{
        type:String
    }
})
const User = mongoose.model("User" , userSchema);

function validateUser(user){
    const schema = new Joi.object({
        username:Joi.string().required().min(5).max(50),
        email:Joi.string().email().min(5).max(50).required(),
        password:Joi.string().required().min(8).max(1024),
    });

    return schema.validate(user);
}

module.exports.validate  = validateUser;
module.exports.User = User;