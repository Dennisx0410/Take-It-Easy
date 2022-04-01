const express = require('express');
const { verifyToken } = require('../controllers/token');
var orderController = require('../controllers/order')

const app = express.Router();

app.get('/fetch', verifyToken, orderController.getOrderByRestaurant)
app.post('/add', verifyToken, orderController.addOrder)
app.post('/done', verifyToken, orderController.finishOrder)

module.exports = app;