// packages
const Customer = require("../models/customer")
const Restaurant = require("../models/restaurant")
const Order = require("../models/order")
const foodItem = require("../models/food_item.js")
const restCtrler = require("../controllers/restaurant");
const { default: mongoose } = require("mongoose")
const { getRestaurantById } = require("./restaurant")
const socketio = require('./socketIO')
const Notification = require("../models/notification")

module.exports = {
    getOrderByRestaurant : async (req, res) => {
      // TODO : Fetch Order from database
      try {
          const orders = await Order.find({restaurantID: req.restaurant._id}).populate('items').populate('restaurantID').populate('customerID')
          res.send(orders)
      } catch (err) {
          console.log(err)
          res.send(err)
      }
    },

    getOrderByCustomer: async (req, res) => {
      // TODO : Fetch Order from database
      try {
        const orders = await Order.find({customerID: req.customer._id}).populate('items').populate('restaurantID').populate('customerID')
        res.send(orders)
      } catch (err) {
        console.log(err)
        res.send(err)
      }
    },

    getOrderByID : async (req, res) => {
      // TODO : Fetch Order from database
      try {
        const order = await Order.findOne({_id: req.body.orderId}).populate('items').populate('restaurantID').populate('customerID')
        res.send(order)
      } catch (err) {
        console.log(err)
        res.send(err)
      }
    },

    getOrderByIDParams: async (req, res) =>{
      try {
        const order = await Order.findOne({_id: req.params.id}).populate('items').populate('restaurantID').populate('customerID')
        res.send(order)
      } catch (err) {
        console.log(err)
        res.send(err)
      }
    },

    addOrder : async (req, res) => {
      // TODO : Add order to database
      try {
        let restaurant = await restCtrler.getRestaurantById(req.body.restaurantID);
        // let restaurant = await Restaurant.findOne({_id:req.body.restaurantID})
        // if (restaurant == undefined){
        //   throw "No such restaurant to place order"
        // }
        let orderDoc = {}
        orderDoc.customerID = req.customer._id
        orderDoc.restaurantID = req.body.restaurantID
        if (req.body.items.length < 1){
          throw "Can't place empty order"
        }
        orderDoc.items = req.body.items
        orderDoc = await Order.create(req.body)
        orderDoc = await Order.findById(orderDoc._id).populate("customerID").populate("restaurantID").populate("items")
        socketio.sendOrder(restaurant.username, orderDoc)
        res.status(201).send(orderDoc)
      }
      catch (err) {
          res.status(400).send(err)
          console.log(err)
      }
    },
    
    finishOrder: async (req, res, next) => {
      // TODO: complete an order
      console.log('> finish order');
        try {
          //The Request sender is not a restaurant
          // this part can be ignored because it is catched by verifyToken
          // if (req.restaurant == undefined) {
          //   throw {name: 'NotARestaurantError', message: 'Only Restaurant can updated order status!'};
          // }
          console.log('Order', req.body.orderNo, "Finish")
          let doc = await Order.findOne({orderNo: req.body.orderNo})
          //Check if the order is already finished
          if (doc.status) {
            throw {namer: 'OrderAlreadyFinshed', message: `Order No:${req.body.orderId} already finished!`};
          }

          doc.status = true;
          await doc.save();

          //TODO: Add function to SOCKET.IO to alert user
          const orders = await Order.findOne({orderNo: req.body.orderNo}).populate('customerID').populate('restaurantID').populate('items')

          let noti = {};
          let targettype = "";
          noti.reciever = orders.customerID.username;
          noti.sender = req.restaurant.username;
          targettype = "customer";
          noti.message = `Your order #${orders.orderNo} placed at ${req.restaurant.restaurantName} is ready for pick up!`;
          let notiDoc = await Notification.create(noti);
          console.log("> Created new targeted noti to",noti.reciever);
          socketio.notifySingle(noti.reciever, targettype, notiDoc);

          // continue to notify target customer
          res.status(200).send({message:`Order ${doc._id} status have been updated`})
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },

    getAllOrderData: async (req, res) =>{
      try {
        const orders = await Order.find().populate('items').populate('restaurantID').populate('customerID')
        res.status(200).send(orders)
      } catch (err) {
        console.log(err)
        res.status(400).send(err)
      }
    }
}