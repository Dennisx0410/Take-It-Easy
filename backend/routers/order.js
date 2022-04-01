const express = require('express');
const { verifyToken } = require('../controllers/token');
var orderController = require('../controllers/order')

const app = express.Router();

app.get('/fetchByRestaurant', verifyToken, orderController.getOrderByRestaurant)
app.get('/fetchByCustomer', verifyToken, orderController.getOrderByCustomer)
app.post('/add', verifyToken, orderController.addOrder)
app.post('/done', verifyToken, orderController.finishOrder)

module.exports = app;