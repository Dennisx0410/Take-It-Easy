const express = require('express');
const { login } = require('../controllers/admin');
const { getCustomers } = require('../controllers/customer');
const { verifyToken } = require('../controllers/token');
const Customers = require('../models/customer');

const app = express.Router();

app.post('/signin', login);
app.get('/customers', verifyToken, getCustomers); 
// to clear all customer account with 'test@test.com' for easy development, should be removed at final version
app.delete('/customers', async (req, res) => {
    console.log('hi');
    await Customers.deleteMany({email: 'test@test.com'});
    res.send('cleared');
})
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', value: 'Request in /admin not found'});
})

module.exports = app;