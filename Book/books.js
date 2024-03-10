require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');

// Connect
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

const app = express();
const port = 3000;
app.use(express.json());

app.post('/book', (req, res) => {
    const newBook = new Book(req.body);
    newBook.save().then(() => {
        res.send('New Book added successfully!');
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/book', (req, res) => {
    Book.find().then((books) => {
        if (books.length !== 0) {
            res.json(books);
        } else {
            res.status(404).send('Books not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Book not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.delete('/book/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id).then((book) => {
        if (book) {
            res.json('Book deleted successfully!');
        } else {
            res.status(404).send('Book not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Book service`);
});
