const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique:true
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:200,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

// const User = mongoose.model('User',UserSchema);

function validateRegisterUser(obj){
    const schema = joi.object({
        email:joi.string().trim().min(5).max(100).email(),
        userName:joi.string().trim().min(2).max(200),
        password:joi.string().trim().min(6),
    });

    return schema.validate(obj);
}

function validateLoginUser(obj){
    const schema = joi.object({
        email:joi.string().trim().min(5).max(100).required().email(),
        password:joi.string().trim().min(6).required()
    });

    return schema.validate(obj);
}

function validateUpdateUser(obj){
    const schema = joi.object({
        email:joi.string().trim().min(5).max(100).email(),
        userName:joi.string().trim().min(2).max(200),
        password:joi.string().trim().min(6),
    });

    return schema.validate(obj);
}

//Generate Token
UserSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id,isAdmin: this.isAdmin},process.env.JWT_SECRET_KEY,{ expiresIn:"4d"});
}

const User = mongoose.model('User',UserSchema);

module.exports = {
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser
};