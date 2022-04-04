const express = require('express');
const custCtrler = require('../controllers/customer');
const { verifyToken } = require('../controllers/token');
const { verifyEmail } = require('../controllers/email');
const { changePw } = require('../controllers/customer');

const app = express.Router();

app.post("/signup", custCtrler.uploadProfilePic, custCtrler.addCustomer, custCtrler.setProfilePic, verifyEmail);
app.post('/activate', custCtrler.verifyOTP, custCtrler.activateAccount); 
app.post('/reverify', verifyEmail); 
app.post('/signin', custCtrler.login, verifyEmail);
app.update('/password', verifyToken, changePw); 
app.get('/data', verifyToken, custCtrler.getCustomerData); 
app.post('/logout', verifyToken, custCtrler.logout);
app.post('/profilePic', verifyToken, custCtrler.uploadProfilePic, custCtrler.setProfilePic, (req, res) => {
    res.send({name: 'ChangedProfilePic', message: 'successfully uploaded and changed profile pic'});
}); // set profile pic
app.get('/profilePic', verifyToken, custCtrler.getProfilePic); // get profile pic

// unrouted requests
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', value: 'Request in /customer not found'});
})

module.exports = app;