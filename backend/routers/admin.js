const express = require('express');
const { login } = require('../controllers/admin');
const { getCustomers } = require('../controllers/customer');
const { verifyToken } = require('../controllers/token');
const Customers = require('../models/customer');
const { Otp } = require('../models/otp');
const Restaurants = require('../models/restaurant');

const app = express.Router();

app.post('/signin', login);
app.get('/customers', verifyToken, getCustomers); 

// dev only
// to clear all customer account with 'test@test.com' for easy development, should be removed at final version
app.delete('/customers', async (req, res) => {
    await Customers.deleteMany({email: 'test@test.com'});
    res.send('cleared');
})
// to clear all restaurants account with 'test@test.com' for easy development, should be removed at final version
app.delete('/restaurants', async (req, res) => {
    await Restaurants.deleteMany({email: 'test@test.com'});
    res.send('cleared');
})
// to clear all otp account for easy development, should be removed at final version
app.delete('/restaurants', async (req, res) => {
    await Otp.deleteMany();
    res.send('cleared');
})

// unrouted requests
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', message: 'Request in /admin not found'});
})

module.exports = app;