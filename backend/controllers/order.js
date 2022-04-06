const Customer = require("../models/customer")
const Restaurant = require("../models/restaurant")
const Order = require("../models/order")
const foodItem = require("../models/food_item.js")
const { default: mongoose } = require("mongoose")

module.exports = {
    getOrderByRestaurant : async (req,res) => {
        //TODO : Fetch Order from database
        try {
            console.log("Fetch orders from", req.restaurant.username)
            const orders = await Order.aggregate([     //Joining two db to get order detail
                {
                  $match: {
                    restaurantID: req.restaurant.username
                  }
                },
                {
                  $lookup: {
                    from: 'fooditems', // secondary Db Name
                    localField: 'items',
                    foreignField: '_id',
                    as: 'items' // output key to be store
                  }
                },
                {
                  $lookup:{
                    from: 'restaurants',
                    localField: 'restaurantID',
                    foreignField: 'username',
                    pipeline:[{$project:{'_id':0,'restaurantName':1}}],
                    as: 'restaurant_Info'
                  },
                },
                {
                  $lookup:{
                    from: 'customers',
                    localField: 'customerID',
                    foreignField: 'username',
                    as: 'customer_Info',
                    pipeline:[{$project:{'_id':0,'username':1}}]
                  },
                }
              ]);
              res.send(orders)
        } catch (err) {
            console.log(err)
            res.send(err)
        }

    },

    getOrderByCustomer: async (req,res) =>{
        try {
            console.log("Fetch orders from", req.customer.username)
            const orders = await Order.aggregate([     //Joining two db to get order detail
                {
                  $match: {
                    customerID: req.customer.username
                  }
                },
                {
                  $lookup: {
                    from: 'fooditems', // secondary Db Name
                    localField: 'items',
                    foreignField: '_id',
                    as: 'items' // output key to be store
                  }
                },
                {
                  $lookup:{
                    from: 'restaurants',
                    localField: 'restaurantID',
                    foreignField: 'username',
                    as: 'restaurant_Info',
                    pipeline:[{$project:{'_id':0,'restaurantName':1}}]
                  },
                },
                {
                  $lookup:{
                    from: 'customers',
                    localField: 'customerID',
                    foreignField: 'username',
                    pipeline:[{$project:{'_id':0,'username':1}}],
                    as: 'customer_Info'

                  },
                }
              ]);
              res.send(orders)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },

    getOrderByID : async (req,res) =>{
        try {
          console.log("Fetch orders from", req.customer.username)
          const orders = await Order.aggregate([     //Joining two db to get order detail
              {
                $match: {
                  _id: req.body.orderId
                }
              },
              {
                $lookup: {
                  from: 'fooditems', // secondary Db Name
                  localField: 'items',
                  foreignField: '_id',
                  as: 'items' // output key to be store
                }
              },
              {
                $lookup:{
                  from: 'restaurants',
                  localField: 'restaurantID',
                  foreignField: 'username',
                  as: 'restaurant_Info',
                  pipeline:[{$project:{'_id':0,'restaurantName':1}}]
                },
              },
              {
                $lookup:{
                  from: 'customers',
                  localField: 'customerID',
                  foreignField: 'username',
                  pipeline:[{$project:{'_id':0,'username':1}}],
                  as: 'customer_Info'

                },
              }
            ]);
            res.send(orders)
      } catch (err) {
          console.log(err)
          res.send(err)
      }
    },

    addOrder : async (req,res) => {
        console.log('New Order Recieved')
        try{
            console.log(req.body.restaurantID)
            let restaurant = await Restaurant.findOne({username:req.body.restaurantID})
            if (restaurant == undefined){
              throw "No such restaurant to place order"
            }
            let orderDoc = {}
            orderDoc.customerID = req.customer.username
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
          req.body.targetUser = doc.customerID
          req.body.message = `Your order placed at ${req.restaurant.restaurantName} is ready for pick up!`
          next()
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },

    getAllOrderData: async (req, res) =>{
      try {
        let orders = await Order.aggregate([
          {
            $lookup:{
              from: 'fooditems', // secondary Db Name
                    localField: 'items',
                    foreignField: '_id',
                    as: 'items' // output key to be store
            }
          }
        ])
        res.status(200).send(orders)
      } catch (err) {
        console.log(err)
        res.status(400).send(err)
      }
    }
}