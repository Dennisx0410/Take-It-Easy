const express = require('express');
const loginController = require('../controllers/login')
const app = express.Router();


app.post('/signup', loginController.signup);
app.post('/signin', loginController.signin);
app.post('/dosth', loginController.verifyToken, (req, res) => {
    res.send("do sth");
});
app.all('/*', (req, res) => {
    res.status(401).send({}); // 401: unauthorized
})

module.exports = app;