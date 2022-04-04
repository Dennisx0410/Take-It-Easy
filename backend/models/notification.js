// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const notificationSchema = new Schema({
    reciever : String,
    sender : String,
    message : String
}, {timestamps: true});

const Notification = mongoose.model('Notifications', notificationSchema);
module.exports = Notification;