const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Author,validateCreateAuthor,validateUpdateAuthor } = require('../models/Author');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

/**
 * @desc   Get All authors
 * @route  /api/authors
 * @method GET
 * @access public
 */
router.get('/',async (req,res)=>{
    try{
        const authorList = await Author.find();
        res.status(200).json(authorList);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
});
// this is as same as the above ,you can use any one you prefare, it less code and don`t need to write try catch
// router.get('/',asyncHandler (async (req,res)=>{
//     const authorList = await Author.find();
//     res.status(200).json(authorList);
// }));

/**
 * @desc   Get author by id
 * @route  /api/authors/:id
 * @method GET
 * @access public
 */
router.get('/:id',async (req,res)=>{
    const author = await Author.findById(req.params.id);
    if(author){
        res.status(200).json(author);
    }else{
        res.status(404).json({message:"author not found"});
    }
});

/**
 * @desc   Create New Author
 * @route  /api/authors
 * @method POST
 * @access private (only admin)
 */
router.post('/',verifyTokenAndAdmin,async (req,res)=>{

    const { error } = validateCreateAuthor(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    try{
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image
        });
    
        const result = await author.save();
        res.status(201).json(result) //=>201 created successfully;
    }catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
});

/**
 * @desc   Update an author
 * @route  /api/authors/:id
 * @method PUT
 * @access private (only admin)
 */
router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{

    const { error } = validateUpdateAuthor(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const author = await Author.findByIdAndUpdate(req.params.id,{
        $set: {
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            nationality:req.body.nationality,
            image:req.body.image
        }
    },{ new : true });
    
    res.status(200).json(author);
});

/**
 * @desc   Delete an author
 * @route  /api/authors/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete('/:id',verifyTokenAndAdmin,async (req,res)=>{

    try {
        const author = await Author.findById(req.params.id);

    if(author){
        await Author.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "author has been deleted"});
    }else{
        return res.status(404).json({message:"author not found"});
    }
    } catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
});

module.exports = router