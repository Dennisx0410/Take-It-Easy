const Customer = require("../models/customer")
const Restaurant = require("../models/restaurant")
const Order = require("../models/order")
const foodItem = require("../models/food_item.js")
const { default: mongoose } = require("mongoose")

module.exports = {
    getOrderByRestaurant : async (req,res) => {
        //TODO : Fetch Order from database
        try {
            const orders = await Order.find({restaurantID: req.restaurant._id}).populate('items').populate('restaurantID').populate('customerID')
            res.send(orders)
        } catch (err) {
            console.log(err)
            res.send(err)
        }

    },

    getOrderByCustomer: async (req,res) =>{
        try {
            const orders = await Order.find({customerID: req.customer._id}).populate('items').populate('restaurantID').populate('customerID')
            res.send(orders)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },

    getOrderByID : async (req,res) =>{
        try {
          const order = await Order.findOne({_id: req.body.orderId}).populate('items').populate('restaurantID').populate('customerID')
          res.send(order)
      } catch (err) {
          console.log(err)
          res.send(err)
      }
    },

    addOrder : async (req,res) => {
        try{
            let restaurant = await Restaurant.findOne({_id:req.body.restaurantID})
            if (restaurant == undefined){
              throw "No such restaurant to place order"
            }
            let orderDoc = {}
            orderDoc.customerID = req.customer._id
            orderDoc.restaurantID = req.body.restaurantID
            if (req.body.items.length < 1){
              throw "Can't place empty order"
            }
            orderDoc.items = req.body.items
            orderDoc = await Order.create(req.body)
            console.log("Created order Document as follow")
            console.log(orderDoc)
            res.status(201).send(orderDoc)
        }
        catch (err){
            res.status(400).send(err)
            console.log(err)
        }
    },
    
    finishOrder: async (req,res, next)=>{
        try {
          //The Request sender is not a restaurant
          if (req.restaurant == undefined){
            throw "Only Restaurant can updated order status!"
          }
          console.log('Order', req.body.orderId, "Finish")
          let doc = await Order.findOne({_id:req.body.orderId})
          //Check if the order is already finished
          if (doc.status){
            throw `Order with ID ${req.body.orderId} already finished!`
          }

          doc.status = true
          await doc.save()
          //TODO: Add function to SOCKET.IO to alert user
          const orders = await Order.findOne({_id: req.body.orderId}).populate('customerID')
          req.body.targetUser = orders.customerID.username
          req.body.message = `Your order placed at ${req.restaurant.restaurantName} is ready for pick up!`
          next()
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },

    getAllOrderData: async (req, res) =>{
      try {
        const orders = await Order.find({_id: req.body.orderId}).populate('items').populate('restaurantID').populate('customerID')
        res.status(200).send(orders)
      } catch (err) {
        console.log(err)
        res.status(400).send(err)
      }
    }
}