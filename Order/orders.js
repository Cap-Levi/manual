require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const axios = require('axios');

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

const Order = require('./order');
const app = express();
const port = 9000;
app.use(express.json());

app.post('/order', (req, res) => {
    const newOrder = new Order({
        customerID: mongoose.Types.ObjectId(req.body.customerID),
        bookID: mongoose.Types.ObjectId(req.body.bookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    });
    newOrder.save().then(() => {
        res.send('New order added successfully!');
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/order', (req, res) => {
    Order.find().then((orders) => {
        if (orders) {
            res.json(orders);
        } else {
            res.status(404).send('Orders not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if (order) {
            axios.get(`http://localhost:5000/customer/${order.customerID}`).then((response) => {
                let orderObject = {
                    CustomerName: response.data.name,
                    BookTitle: ""
                };
                axios.get(`http://localhost:3000/book/${order.bookID}`).then((response) => {
                    orderObject.BookTitle = response.data.title;
                    res.json(orderObject);
                });
            });
        } else {
            res.status(404).send('Order not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Order service`);
});
