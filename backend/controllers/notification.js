/* 
PROGRAM notification - Controller of notification functionality

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing functions for the server to send notification to user, and handle notification related request

MODULES:
socketio: Enable real time communication between server and client

USAGE: 
Exporting notification function to other module, mainly for sending notification to user upon order completion.
*/


const Notification = require("../models/notification");
const socketio = require("./socketIO");

//Export function for other module to use
module.exports = {
  //Function for sending real-time notification to all user
  globalNoti: async (req, res) => {
    try {
      //Restrict premission to admin
      if (req.restaurant != undefined || req.customer != undefined) {
        throw "Global Noti can't be created with normal token!";
      }
      let noti = {};
      //Set notification reciever
      noti.reciever = "All";
      //Set Sender
      noti.sender = "Administrator";
      //Set Message
      noti.message = req.body.message;
      //Create new notification with structure defined in notification schema
      noti = await Notification.create(noti);
      //Call socketio module to notify all connected clients
      socketio.notifyAll(noti);
      res.status(201).send(noti);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  //Function for fetching all notification
  fetchAll: async (req, res) => {
    try {
      let noti = await Notification.find({}).sort({ createdAt: -1 });
      res.status(200).send(noti);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  //Function for fetching personal notification by customer username
  fetchIndividual: async (req, res) => {
    try {
      //Check if the request is made by customer
      if (req.customer != undefined) {
        //Search the database by customer username equal to the reciever name or reciever is All and also not dismissed
        let noti = await Notification.find({
          $or: [{ reciever: req.customer.username }, { reciever: "All" }],
          dismissed: false,
        })
          //Sort the notification by time, in descending manner
          .sort({ createdAt: -1 })
          //Limit the number of returning notification as maximum 5
          .limit(5);
        res.status(200).send(noti);
      }
    } catch (err) {
      res.status(401).send(err);
    }
  },
  //Function for sending targeted notification
  targetedNoti: async (req, res) => {
    try {
      let noti = {};
      let targettype = "";
      //Set notification reciever
      noti.reciever = req.body.targetUser;
      if (req.restaurant != undefined) {
        //If sender is restaurant, target type is customer
        noti.sender = req.restaurant.username;
        targettype = "customer";
      } else {
        //Else is restaurant
        noti.sender = req.customer.username;
        targettype = "restaurant";
      }
      //Set notification message
      noti.message = req.body.message;
      //Create new notification follow notification structure
      noti = await Notification.create(noti);
      //Call socketio module to notify the reciever
      socketio.notifySingle(noti.reciever, targettype, noti);
      res.status(201).send(noti);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  //Function dismissing a notification
  dismissNotification: async (req, res) => {
    try {
      //Find the notification by ID
      let noti = await Notification.findById(req.params.id);
      if (noti === undefined) {
        //If not found, throw exception
        throw `Notification with id ${req.params.id} not exist`;
      }
      //Change the notification dismissed status to true
      noti.dismissed = true;
      //Commit changes to the database
      await noti.save();
      res.status(200).send(`Dismissed Notification with id ${req.params.id}`);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
