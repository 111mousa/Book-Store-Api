const express = require("express");
const router = express.Router();
const {Book,validateCreateBook,validateUpdateBook} = require('../models/Book');
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

/**
 * @desc   Get All Books
 * @route  /api/books
 * @method GET
 * @access public
 */
router.get('/',asyncHandler(async (req,res)=>{
    const books = await Book.find().populate('author',['_id','firstName','lastName']);
    res.status(200).json(books);
}));

/**
 * @desc   Get book by id
 * @route  /api/books/:id
 * @method GET
 * @access public
 */
router.get('/:id',asyncHandler(async (req,res)=>{
    const book = await Book.findById(req.params.id).populate('author',['_id','firstName','lastName']);
    if(book){
        console.log(book)
        res.status(200).json(book);
    }else{
        res.status(404).json({message:"book not found"});
    }
}));

/**
 * @desc   Create New Book
 * @route  /api/books
 * @method POST
 * @access private (only admin)
 */
router.post('/',verifyTokenAndAdmin,asyncHandler(async (req,res)=>{

    const { error } = validateCreateBook(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    });

    const newBook = await book.save();
    res.status(201).json(newBook) //=>201 created successfully;
    
}));

/**
 * @desc   Update a book
 * @route  /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
router.put('/:id',verifyTokenAndAdmin,asyncHandler(async(req,res)=>{

    const { error } = validateUpdateBook(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    const updateBook = await Book.findByIdAndUpdate(req.params.id,{$set:{
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    }},{ new : true });

    res.status(200).json(updateBook);

}));

/**
 * @desc   Delete a book
 * @route  /api/books/:id
 * @method DELETE
 * @access private (only admin)
 */
router.delete('/:id',verifyTokenAndAdmin,asyncHandler(async(req,res)=>{

    const book = await Book.findById(req.params.id);

    if(book){
        await Book.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: "book has been deleted"});
    }else{
        return res.status(404).json({message:"book not found"});
    }
}));

module.exports = router;