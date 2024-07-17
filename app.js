const express = require("express");
const booksPath = require('./routes/books');
const authorsPath = require('./routes/authors');
const authPath = require('./routes/auth');
const usersPath = require('./routes/users');
const connectToDB = require('./config/db');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const {notFound,errorHandler} = require('./middlewares/errors');
dotenv.config();

//connection to db
connectToDB();
//Init App
const app = express();

//Apply Midlewares
app.use(express.json());
// app.use(logger);
app.use('/api/books',booksPath);
app.use('/api/authors',authorsPath);
app.use('/api/auth',authPath);
app.use('/api/users',usersPath);

//Error Handler Middleware

app.use(notFound);
app.use(errorHandler);

//Running The Server
const PORT = process.env.PORT;
app.listen(PORT,console.log(`Server is runnung on port ${PORT}`));