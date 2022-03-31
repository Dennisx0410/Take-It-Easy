const express = require('express');
const { login } = require('../controllers/admin');
const { getCustomers } = require('../controllers/customer');
const { verifyToken } = require('../controllers/token');

const app = express.Router();

app.post('/signin', login);
app.get('/customers', verifyToken, getCustomers); 
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', value: 'Request in /admin not found'});
})

module.exports = app;