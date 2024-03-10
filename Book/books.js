require("dotenv").config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

const Book = require('./book');

exports.createBook = async (req, res) => {
    const newBook = new Book(req.body);
    try {
        await newBook.save();
        res.send('New Book added successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length !== 0) {
            res.json(books);
        } else {
            res.status(404).send('Books not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.deleteBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndRemove(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.send('Book deleted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};
