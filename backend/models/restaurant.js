// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const restaurantSchema = new Schema({
    restaurantID : Number,
    username : String,
    restaurantName : String,
    password : String,
    phoneNum : String,
    profilePicture : String,
    address : String,
    licenseNum : String,
    menu : [Object]
});

const Restaurants = mongoose.model('Restaurants', restaurantSchema);
module.exports = Restaurants;