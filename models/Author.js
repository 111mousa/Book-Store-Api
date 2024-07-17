const mongoose = require('mongoose');
const joi = require('joi');


const AuthorSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200
    },
    nationality:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:100
    },
    image:{
        type:String,
        default:"default-avatar.png",
    },
},{
    timestamps:true // create in the database two column : created at , updated at
});

const Author = mongoose.model("Author",AuthorSchema);

function validateCreateAuthor(obj){
    
    const schema = joi.object({
        firstName: joi.string().trim().min(3).max(200).required(),
        lastName: joi.string().trim().min(3).max(200).required(),
        nationality: joi.string().trim().min(2).max(100).required(),
        image: joi.number().min(0),
    });

    return schema.validate(obj);
}

function validateUpdateAuthor(obj){
    
    const schema = joi.object({
        firstName: joi.string().trim().min(3).max(200),
        lastName: joi.string().trim().min(3).max(200),
        nationality: joi.string().trim().min(2).max(100),
        image: joi.number().min(0),
    });

    return schema.validate(obj);
}

module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
}