/* 
PROGRAM order - Controller of order functionality

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing functions for the server to handle order related request and provide respond

MODULES:
socketio: Enable real time communication between server and client

USAGE: 
Exporting order function to other module. Handling the routed request under /order domain
*/

// packages
const Order = require("../models/order");
const custCtrler = require("../controllers/customer");
const restCtrler = require("../controllers/restaurant");
const socketio = require("./socketIO");
const Notification = require("../models/notification");

//Export functions for other module to use
module.exports = {
  //Function for fetching all order by restaurant id, given by the token
  getOrderByRestaurant: async (req, res) => {
    try {
      //Find all order corresponding the the restaurant id
      const orders = await Order.find({ restaurantID: req.restaurant._id })
      //Populate function combine other databases data with linking them correspondingly by their object id, increasing maintainability
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(orders);
    } catch (err) {
      res.send(err);
    }
  },

  //Function for fetching all order by customer id, given by the token
  getOrderByCustomer: async (req, res) => {
    try {
      //Find all order by the corresponding customer id
      const orders = await Order.find({ customerID: req.customer._id })
      //Populate function combine other databases data with linking them correspondingly by their object id, increasing maintainability
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(orders);
    } catch (err) {
      res.send(err);
    }
  },

  //Function for fetching an order by order object id in the request body
  getOrderByID: async (req, res) => {
    try {
      //Find the order with correspond orderID
      const order = await Order.findOne({ _id: req.body.orderId })
       //Populate function combine other databases data with linking them correspondingly by their object id, increasing maintainability
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(order);
    } catch (err) {
      res.send(err);
    }
  },

  //Function for fetching an order by order object id specify in the URL
  getOrderByIDParams: async (req, res) => {
    try {
      //Find the order with correspond orderID
      const order = await Order.findOne({ _id: req.params.id })
      //Populate function combine other databases data with linking them correspondingly by their object id, increasing maintainability
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.send(order);
    } catch (err) {
      res.send(err);
    }
  },

  //Function for creating new order
  addOrder: async (req, res) => {
    try {
      let customer = req.customer;
      let orderDoc = {};
      //Set customer id of the order
      orderDoc.customerID = customer._id;
      //Set restaurant id of the order
      orderDoc.restaurantID = req.body.restaurantID;
      //Find the restaurant with given id
      let restaurant = await restCtrler.getRestaurantById(
        orderDoc.restaurantID
      );

      // check if empty order
      if (req.body.items.length < 1) {
        throw { name: "EmtpyOrderError", message: "Can't place empty order" };
      }

      // check if enough points for coupon
      if (customer.points < req.body.couponUsed) {
        throw {
          name: "NotEnoughPointsForCoupon",
          message: "Not enough points for coupon",
        };
      }
      //Set the ordered food item
      orderDoc.items = req.body.items;
      //Create new order according to the structure defined in schema
      orderDoc = await Order.create(orderDoc);
      //Refetch the order document to provide more detail of the order
      orderDoc = await Order.findById(orderDoc._id)
      //Populate function combine other databases data with linking them correspondingly by their object id, increasing maintainability
        .populate("customerID")
        .populate("restaurantID")
        .populate("items");

      // calculate total amount
      let total = 0;
      orderDoc.items.forEach((food) => {
        total += food.price;
      });

      // check if matched total amount
      if (total != req.body.total) {
        await Order.deleteOne(orderDoc._id);
        throw {
          name: "AmountMismatchedAndRejectOrder",
          message:
            "The sent amount is not matched with calculated total, order rejected",
        };
      }

      //Calculate net total
      let netTotal = total - req.body.couponUsed;
      orderDoc.total = total;
      orderDoc.couponUsed = req.body.couponUsed;
      orderDoc.netTotal = netTotal;
      customer.points -= req.body.couponUsed;

      // update customer points
      customer.points += Math.floor(netTotal / 5);
      await customer.save();
      orderDoc.customerID.points = customer.points;
      await orderDoc.save();

      socketio.sendOrder(restaurant.username, orderDoc);
      res.status(201).send(orderDoc);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  //Function for Completing the order
  finishOrder: async (req, res, next) => {
    try {
      let doc = await Order.findOne({ orderNo: req.body.orderNo });
      //Check if the order is already finished
      if (doc.status) {
        throw {
          namer: "OrderAlreadyFinshed",
          message: `Order No:${req.body.orderId} already finished!`,
        };
      }
      //Set order status as true, indicating completion
      doc.status = true;
      //Commit changes to db
      await doc.save();

      //Fetch the order detail
      const orders = await Order.findOne({ orderNo: req.body.orderNo })
        .populate("customerID")
        .populate("restaurantID")
        .populate("items");

      //function to SOCKET.IO to alert user
      let noti = {};
      let targettype = "";
      noti.reciever = orders.customerID.username;
      noti.sender = req.restaurant.username;
      targettype = "customer";
      noti.message = `Your order #${orders.orderNo} placed at ${req.restaurant.restaurantName} is ready for pick up!`;
      let notiDoc = await Notification.create(noti);
      socketio.notifySingle(noti.reciever, targettype, notiDoc);

      // continue to notify target customer
      res
        .status(200)
        .send({ message: `Order ${doc._id} status have been updated` });
    } catch (err) {
      res.send(err);
    }
  },

  //Function for fetching all order.
  getAllOrderData: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("items")
        .populate("restaurantID")
        .populate("customerID");
      res.status(200).send(orders);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
