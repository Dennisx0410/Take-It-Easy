const express = require('express');
const restaurantController = require("../controllers/restaurant");

const app = express.Router();

app.post('/signup', restaurantController.addRestaurant); 
app.post('/activate', restaurantController.activeAccount); 
app.post('/signin', restaurantController.login);
// app.post('/update', verifyToken, updateCustomer); // not implemented yet
app.post('/getinfo', restaurantController.verifyToken, restaurantController.getRestaurantData);
app.get('/getAll', restaurantController.verifyToken, restaurantController.getAllRestaurantData)
app.get('/getNotActive', restaurantController.getNotActivatedRestaurant)
app.post('/logout', restaurantController.verifyToken, restaurantController.logout);
app.post('/profilePic', restaurantController.verifyToken, restaurantController.uploadProfilePic, restaurantController.setProfilePic); // set profile pic
app.get('/profilePic', restaurantController.verifyToken, restaurantController.getProfilePic); // get profile pic
app.all('/*', (req, res) => {
    res.status(403).send({});
})

module.exports = app;