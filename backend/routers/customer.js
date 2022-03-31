const express = require('express');
const { 
    uploadProfilePic, addCustomer, login, logout, 
    setProfilePic, getProfilePic, activateAccount, 
    updateCustomer, verifyOTP, getCustomerData 
} = require('../controllers/customer');
const { verifyToken } = require('../controllers/token');
const { verifyEmail } = require('../controllers/email');

const app = express.Router();

app.post("/signup", uploadProfilePic, addCustomer, setProfilePic, verifyEmail);
app.post('/activate', verifyOTP, activateAccount); 
app.post('/reverify', verifyEmail); 
app.post('/signin', login);
// app.post('/update', verifyToken, updateCustomer); // not implemented yet
app.get('/data', verifyToken, getCustomerData); 
app.post('/logout', verifyToken, logout);
app.post('/profilePic', verifyToken, uploadProfilePic, setProfilePic, (req, res) => {
    res.send({name: 'ChangedProfilePic', message: 'successfully uploaded and changed profile pic'});
}); // set profile pic
app.get('/profilePic', verifyToken, getProfilePic); // get profile pic
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', value: 'Request in /customer not found'});
})

module.exports = app;