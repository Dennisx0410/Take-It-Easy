/* 
PROGRAM model/notification - A mongoose schema module.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Defining essential structure of notification document stored in the database

USAGE: 
Define the structure of notification document stored in the mongodb database by mongosoe Schema.
*/

// packages
const mongoose = require("mongoose");
const { bool } = require("sharp");
const Schema = mongoose.Schema;

//Struture of notification
const notificationSchema = new Schema(
  {
    reciever: String,
    sender: String,
    message: String,
    dismissed: Boolean,
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notifications", notificationSchema);
//Export the structure of the notification for other module
module.exports = Notification;
