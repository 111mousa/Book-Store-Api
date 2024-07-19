const { Book } = require('./models/Book');
const { books } = require('./data');
const connectToDB = require('./config/db');
require('dotenv').config();

//connection to database
connectToDB();
//seeding the database
const importBooks = async () => {
    try {
        await Book.insertMany(books);
        console.log('Books Imported');
    } catch (error) {
        console.log(error);
        // this line of code is for cut the connection to the database for this file which is seeder file
        process.exit(1);
    }
}

const removeBooks = async () => {
    try {
        // delete all books in database
        await Book.deleteMany();
        console.log('Books Removed');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2] === '-import'){
    importBooks();
}else if(process.argv[2] === '-remove'){
    removeBooks();
}

//To Do That , Imean to run this file 
// you need to put this command in the terminal : node seeder -import/-remove