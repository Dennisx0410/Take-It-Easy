const express = require('express');
const {verifyToken} = require("../controllers/token");
const restaurantController = require("../controllers/restaurant");

const app = express.Router();

app.post('/signup', restaurantController.uploadProfilePic, restaurantController.addRestaurant, restaurantController.setProfilePic, (req, res) => {
    // wait for admin approve register request
    res.send({name: "RegistrationReceived", value: "registration received, wait for admin approval"});
});
app.post('/activate', restaurantController.activeAccount); 
app.post('/signin', restaurantController.login);
// app.post('/update', verifyToken, updateCustomer); // not implemented yet
app.post('/getinfo', verifyToken, restaurantController.getRestaurantData);
app.get('/getAll', verifyToken, restaurantController.getAllRestaurantData)
app.get('/getNotActive', restaurantController.getNotActivatedRestaurant)
app.post('/logout', verifyToken, restaurantController.logout);
app.post('/profilePic', verifyToken, restaurantController.uploadProfilePic, restaurantController.setProfilePic); // set profile pic
app.get('/profilePic', verifyToken, restaurantController.getProfilePic); // get profile pic
app.post('/addFood', verifyToken, restaurantController.uploadFoodItemPic, restaurantController.addFoodItem)
app.post('/removeFood', verifyToken, restaurantController.removeFoodItem)

// unrouted requests
app.all('/*', (req, res) => {
    res.status(403).send({name: 'Forbidden', value: 'Request in /restaurant not found'});
})

module.exports = app;