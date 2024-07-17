const { ref, required } = require('joi');
const mongoose = require('mongoose');
const joi = require('joi');

const BookSchema = mongoose.Schema({
    title: {
        type:String,
        require:true,
        trim:true,
        minlength:3,
        maxlength:250
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Author"
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:5
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    cover:{
        type:String,
        required:true,
        enum:["soft cover","hard cover"]
    }
},{timestamps:true});

function validateCreateBook(obj){
    
    const schema = joi.object({
        title: joi.string().trim().min(3).max(250).required(),
        author: joi.string().required(),
        description: joi.string().min(5).required(),
        price: joi.number().min(0).required(),
        cover : joi.string().valid("soft cover","hard cover").required()
    });

    return schema.validate(obj);
}

function validateUpdateBook(obj){
    
    const schema = joi.object({
        title: joi.string().trim().min(3).max(250),
        author: joi.string(),
        description: joi.string().min(5),
        price: joi.number().min(0),
        cover : joi.string().valid("soft cover","hard cover")
    });

    return schema.validate(obj);
}

const Book = mongoose.model("Book",BookSchema);

module.exports = {
    Book,validateCreateBook,validateUpdateBook
}