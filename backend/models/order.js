// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

// schema
const orderSchema = new Schema({
    customerID : {type : String, required : true},
    restaurantID : {type : String, required : true},
    items : [mongoose.Types.ObjectId],
    total : Number,
    status : {type : Boolean, default : false}
}, {timestamps: true});

//Import plugin for auto increment
orderSchema.plugin(AutoIncrement, {inc_field: 'orderNo'});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;