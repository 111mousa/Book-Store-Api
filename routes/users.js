const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { User,validateUpdateUser } = require("../models/User");
const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin } = require('../middlewares/verifyToken');

/**
 * @desc   Update User
 * @route  /api/users/:id
 * @method PUT
 * @access private
 */
router.put('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{

    const { error } = validateUpdateUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id,{$set:{
        email:req.body.email,
        password:req.body.password,
        userName:req.body.userName
    }},{new:true}).select('-password');    
    
    res.status(200).json(updateUser);
}));

/**
 * @desc   Get All Users
 * @route  /api/users
 * @method GET
 * @access private (Only Admin)
 */
router.get('/',verifyTokenAndAdmin,asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password');
    res.status(200).json(users);

}));

/**
 * @desc   Get User By Id
 * @route  /api/users/:id
 * @method GET
 * @access private (Only Admin & User Himself)
 */
router.get('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{
    
    const user = await User.findById(req.params.id).select('-password');
    
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404).json({message:"User Not Found"});
    }

}));

/**
 * @desc   Delete User By Id
 * @route  /api/users/:id
 * @method DELETE
 * @access private (Only Admin & User Himself)
 */
router.delete('/:id',verifyTokenAndAuthorization,asyncHandler(async(req,res)=>{
    
    const user = await User.findById(req.params.id).select('-password');
    
    if(user){
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"User Has Been Deleted Successfully"});
    }else{
        res.status(404).json({message:"User Not Found"});
    }

}));

module.exports = router;