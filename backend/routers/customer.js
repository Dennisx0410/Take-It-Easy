/* 
PROGRAM router/customer - router for customer related request, generally speaking, handling request with serverURL/customer prefix

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Routing request to their designated function to handle.

USAGE: 
Stating the proper request URL under /customer domain. If it is a valid type of request under /customer domain, route to specified function in controller. All function that should be provided after login need to be verify by a valid customer token in order to be a valid request. Otherwise, it will be rejected. Such token will be issued upon login. Function that available without login can be accessed without a customer token.
*/

const express = require("express");
const custCtrler = require("../controllers/customer");
const { verifyToken } = require("../controllers/token");
const { verifyEmail } = require("../controllers/email");

const app = express.Router();

//Request for signing up a customer
app.post(
  "/signup",
  custCtrler.uploadProfilePic,
  custCtrler.addCustomer,
  custCtrler.setProfilePic,
  verifyEmail
);
//Request for activating a customer
app.post("/activate", custCtrler.verifyOTP, custCtrler.activateAccount);
//Request for reverification (Resent verification email)
app.post("/reverify", verifyEmail);
//Request Customer Signin
app.post("/signin", custCtrler.login, verifyEmail);
//Request for changing customer password
app.post("/changePw", verifyToken, custCtrler.changePw);

//Return custoemr data by the token
app.get("/data", verifyToken, custCtrler.getCustomerData);

//Return customer favourite restaurant
// app.get("/fav", verifyToken, custCtrler.getFavoriteRestaurant);

// Request for customer logout
app.post("/logout", verifyToken, custCtrler.logout);

//Request for setting a profile pic
app.post(
  "/profilePic",
  verifyToken,
  custCtrler.uploadProfilePic,
  custCtrler.setProfilePic,
  (req, res) => {
    res.send({
      name: "ChangedProfilePic",
      message: "successfully uploaded and changed profile pic",
    });
  }
);

//Request for getting the profile pic
app.get("/profilePic", verifyToken, custCtrler.getProfilePic);

// unrouted requests
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", value: "Request in /customer not found" });
});

module.exports = app;
