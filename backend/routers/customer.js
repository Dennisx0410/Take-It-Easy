const express = require('express');
const { 
    uploadProfilePic, addCustomer, login, 
    verifyToken, getCustomerData, logout, 
    setProfilePic, getProfilePic, activateAccount, 
    updateCustomer, verifyOTP 
} = require('../controllers/customer');
const { verifyEmail } = require('../controllers/email');

const app = express.Router();

app.post('/signup', addCustomer, verifyEmail); 
app.post('/reverify', verifyEmail); 
app.post('/activate', verifyOTP, activateAccount); 
app.post('/signin', login);
// app.post('/update', verifyToken, updateCustomer); // not implemented yet
// app.post('/getinfo', verifyToken, getCustomerData); // not completed
app.post('/logout', verifyToken, logout);
app.post('/profilePic', verifyToken, uploadProfilePic, setProfilePic); // set profile pic
app.get('/profilePic', verifyToken, getProfilePic); // get profile pic
app.all('/*', (req, res) => {
    res.status(403).send({});
})

module.exports = app;