/* 
PROGRAM router/admin - router for admin related request, generally speaking, handling request with serverURL/admin prefix

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Routing request to their designated function to handle.

USAGE: 
Stating the proper request URL under /admin domain. If it is a valid type of request under /admin domain, route to specified function in controller. All request need to be verify by a valid admin token in order to be a valid request. Otherwise, it will be rejected.
*/

const express = require("express");
const { login } = require("../controllers/admin");
const { verifyToken } = require("../controllers/token");
const custCtrler = require("../controllers/customer");
const restCtrler = require("../controllers/restaurant");
const Customers = require("../models/customer");
const { Otp } = require("../models/otp");
const Restaurants = require("../models/restaurant");
const { approvalEmail, rejectEmail } = require("../controllers/email");
const orderCtrler = require("../controllers/order");

const app = express.Router();

app.post("/signin", login);

//Request for listing all customers
app.get("/customer/all", verifyToken, custCtrler.getAllCustomerData);
//Request for resetting password for customers
app.post("/customer/resetPw", verifyToken, custCtrler.resetPw);

//Request for approving restaurant 
app.post(
  "/restaurant/approve",
  verifyToken,
  restCtrler.approveAccount,
  approvalEmail
);

//Request for Rejecting restaurant
app.post(
  "/restaurant/reject",
  verifyToken,
  restCtrler.rejectAccount,
  rejectEmail
);
//Request for listing all restaurant
app.get("/restaurant/all", verifyToken, restCtrler.getAllRestaurantData);
//Request for resetting password for restaurant
app.post("/restaurant/resetPw", verifyToken, restCtrler.resetPw);

//Request for listing all order
app.get("/order/all", verifyToken, orderCtrler.getAllOrderData);

//Unspecific request under the /admin domain is rejected
app.all("/*", (req, res) => {
  res
    .status(403)
    .send({ name: "Forbidden", message: "Request in /admin not found" });
});

module.exports = app;
