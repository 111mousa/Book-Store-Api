const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { User,validateLoginUser,validateRegisterUser} = require('../models/User');
const bcrypt = require('bcryptjs');


/**
 * @desc   Register New User
 * @route  /api/auth/register
 * @method POST
 * @access public
 */
router.post('/register',asyncHandler(async(req,res)=>{
    const { error } = validateRegisterUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    let user = await User.findOne({email:req.body.email});

    if(user){
        return res.status(400).json({message:"this user is already registered"});
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password,salt);
    user = new User({
        email:req.body.email,
        password:req.body.password,
        userName:req.body.userName,
    });

    const newUser = await user.save();
    const token = user.generateToken();
    const { password , ...other } = newUser._doc;
    res.status(201).json({...other,token});
}));

/**
 * @desc   Login User
 * @route  /api/auth/login
 * @method POST
 * @access public
 */
router.post('/login',asyncHandler(async(req,res)=>{
    const { error } = validateLoginUser(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    let user = await User.findOne({email:req.body.email});

    if(!user){
        return res.status(400).json({message:"Invalid Email Or Password"});
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);

    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid Email Or Password"});
    }
    const token = user.generateToken();
    const {password,...other} = user._doc;
    res.status(200).json({...other,token});
}));

module.exports = router;