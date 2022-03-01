const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const customerSchema = new Schema({
    memberID : Number,
    username : String,
    password : String,
    phoneNum : String,
    profilePicture : String,
    email : String,
    point : Number,
    registerDate : Date,

}, { timestamps: true});

const Customers = mongoose.model('Customers', customerSchema);
module.exports = Customers;