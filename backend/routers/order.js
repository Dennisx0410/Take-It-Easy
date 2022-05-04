/* 
PROGRAM router/order - router for order related request, generally speaking, handling request with serverURL/order prefix

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Routing request to their designated function to handle.

USAGE: 
Stating the proper request URL under /order domain. If it is a valid type of request under /order domain, route to specified function in controller. Token is used to identify who is making the order and verify if the user is allow to access those functions.
*/

const express = require("express");
const { verifyToken } = require("../controllers/token");
var orderController = require("../controllers/order");
const { targetedNoti } = require("../controllers/notification");

const app = express.Router();

//Request for fetching all orders made to the restaurant, restaurant is specified by the token
app.get(
  "/fetchByRestaurant",
  verifyToken,
  orderController.getOrderByRestaurant
);
//Request for fetching all orders made by the customer, customer is specified by the token
app.get("/fetchByCustomer", verifyToken, orderController.getOrderByCustomer);
//Request for making an order to a restaurant by a customer, custoemr is specified by the token
app.post("/add", verifyToken, orderController.addOrder);
//Request for indicating an order is done, restaurant is identified by the token
app.post("/done", verifyToken, orderController.finishOrder, targetedNoti);
//Request for fetch an order by orderID, need customer token to identify user
app.get("/:id", verifyToken, orderController.getOrderByIDParams);

module.exports = app;
