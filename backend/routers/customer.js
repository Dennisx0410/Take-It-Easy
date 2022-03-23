const express = require('express');
const { uploadProfilePic, addCustomer, login, verifyToken, getCustomerData, logout, setProfilePic, getProfilePic, activateAccount, updateCustomer } = require('../controllers/customer');
const { verifyEmail } = require('../controllers/email');

const app = express.Router();

app.post('/signup', addCustomer, verifyEmail); 
app.get('/activate/:id', activateAccount); 
app.post('/signin', login);
app.post('/update', verifyToken, updateCustomer);
app.post('/getinfo', verifyToken, getCustomerData);
app.post('/logout', verifyToken, logout);
app.post('/setProfilePic', verifyToken, uploadProfilePic, setProfilePic);
app.post('/getProfilePic', verifyToken, getProfilePic);
app.all('/*', (req, res) => {
    res.status(403).send({});
})

module.exports = app;