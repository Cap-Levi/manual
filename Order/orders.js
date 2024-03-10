require("dotenv").config();

const mongoose = require("mongoose");
const axios = require('axios');

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

exports.createOrder = async (req, res) => {
    const newOrder = new Order({
        customerID: mongoose.Types.ObjectId(req.body.customerID),
        bookID: mongoose.Types.ObjectId(req.body.bookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    });
    try {
        await newOrder.save();
        res.send('New order added successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        const customerResponse = await axios.get(`http://localhost:5000/customer/${order.customerID}`);
        const bookResponse = await axios.get(`http://localhost:3000/book/${order.bookID}`);
        const orderObject = {
            CustomerName: customerResponse.data.name,
            BookTitle: bookResponse.data.title
        };
        res.json(orderObject);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};
