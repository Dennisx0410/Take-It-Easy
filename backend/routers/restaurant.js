/* 
PROGRAM router/restaurant - router for restaurant related request, generally speaking, handling request with serverURL/restaurant prefix

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Routing request to their designated function to handle.

USAGE: 
Stating the proper request URL under /restaurant domain. If it is a valid type of request under /restaurant domain, route to specified function in controller. Valid restaurant token is needed for functionality available after login. For those functions available without login, token is not required.
*/

const express = require("express");
const { verifyToken } = require("../controllers/token");
const restCtrler = require("../controllers/restaurant");

const app = express.Router();

//Request for signing up an restaurant account
app.post(
  "/signup",
  restCtrler.uploadProfilePic,
  restCtrler.addRestaurant,
  restCtrler.setProfilePic,
  (req, res) => {
    // wait for admin approve register request
    res.send({
      name: "RegistrationReceived",
      value: "registration received, wait for admin approval",
    });
  }
);
//Request for restaurant login
app.post("/signin", restCtrler.login);
//Request for restaurant changing password
app.post("/changePw", verifyToken, restCtrler.changePw);

//Request for fetching data for the given restaurant by the token
app.get("/data", verifyToken, restCtrler.getRestaurantData);
//Request for fetching all restaurant data
app.get("/all", verifyToken, restCtrler.getAllRestaurantData);
//Request for fetching all not yet approved restaurant
app.get("/notApproved", restCtrler.getNotApprovedRestaurant);
//Request for fetching all approved restaurant
app.get("/approved", restCtrler.getApprovedRestaurant);
//Request for restaurant logout
app.post("/logout", verifyToken, restCtrler.logout);
//Request for setting profile picture
app.post(
  "/profilePic",
  verifyToken,
  restCtrler.uploadProfilePic,
  restCtrler.setProfilePic
);
//Request for getting profile picture
app.get("/profilePic", verifyToken, restCtrler.getProfilePic);
//Request for setting food item picture
app.post(
  "/food",
  verifyToken,
  restCtrler.uploadFoodItemPic,
  restCtrler.addFoodItem
);
//Request for deleting food item from menu
app.delete("/food", verifyToken, restCtrler.removeFoodItem);

// unrouted requests
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", value: "Request in /restaurant not found" });
});

module.exports = app;
