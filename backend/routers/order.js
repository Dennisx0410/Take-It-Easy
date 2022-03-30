const express = require('express');
const { modelName } = require('../models/customer');

const app = express.Router();

// app.get('/hello', (err, res) => {
//     console.log("someone find /hello/hello");
//     res.send('hello hello received')
// })
// app.get('/', (err, res) => {
//     console.log("someone find /hello/");
//     res.send('hello received')
// })

module.exports = app;