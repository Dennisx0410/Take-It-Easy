/* 
PROGRAM router/notification - router for notification related request, generally speaking, handling request with serverURL/notification prefix

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Routing request to their designated function to handle.

USAGE: 
Stating the proper request URL under /notification domain. If it is a valid type of request under /notification domain, route to specified function in controller. Token is used to identify who is making the notification and verify if the user is allow to make notification
*/

const express = require("express");
const { verifyToken } = require("../controllers/token");
const NotificationController = require("../controllers/notification");

const app = express.Router();

//Request for sending a notification to all user
app.post("/globeNoti", verifyToken, NotificationController.globalNoti);
//Request for sending a notification to only one targetted user
app.post("/targetedNoti", verifyToken, NotificationController.targetedNoti);
//Request for fetching all notification made from the database
app.get("/all", NotificationController.fetchAll);
//Request for fetching all notification related to a user from the database
app.get(
  "/fetchIndividual",
  verifyToken,
  NotificationController.fetchIndividual
);
//Request for dismissing a notification
app.post("/dismiss/:id", NotificationController.dismissNotification);
//Handle all unrouted request
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", value: "Request in /notification not found" });
});

module.exports = app;
