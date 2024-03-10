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

const Customer = require('./customer');

exports.createCustomer = async (req, res) => {
    const newCustomer = new Customer(req.body);
    try {
        await newCustomer.save();
        res.send('New Customer created successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};

exports.deleteCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        res.send('Customer deleted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error!');
    }
};
