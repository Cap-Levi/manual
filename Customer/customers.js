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

const Customer = require('./customer');

const app = express();
const port = 5000;
app.use(express.json());

app.post('/customer', (req, res) => {
    const newCustomer = new Customer(req.body);
    newCustomer.save().then(() => {
        res.send('New Customer created successfully!');
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/customer', (req, res) => {
    Customer.find().then((customers) => {
        if (customers) {
            res.json(customers);
        } else {
            res.status(404).send('Customers not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).send('Customer not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndRemove(req.params.id).then((customer) => {
        if (customer) {
            res.json('Customer deleted Successfully!');
        } else {
            res.status(404).send('Customer not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Customer service`);
});
