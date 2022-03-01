const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const orderSchema = new Schema({
    memberID : Number,
    restaurantID : Number,
    items : [Object],
    total : Number,
    deliveryAddress : String,
    status : String
}, {timestamps: true});

const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;