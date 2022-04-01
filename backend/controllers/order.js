const Customer = require("../models/customer")
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
            console.log(req.body)
            let orderDoc = await Order.create(req.body)
            console.log("Created order Document as follow")
            console.log(orderDoc)
            res.status(201).send(orderDoc)
        }
        catch (err){
            res.status(400).send(err)
            console.log(err)
        }
    },
    
    finishOrder: async (req,res)=>{
        console.log('Order', req.body.orderId, "Finish")
        try {
            let doc = await Order.findOne({_id:req.body.orderId})
            doc.status = true
            await doc.save()
            //TODO: Add function to SOCKET.IO to alert user
            res.send("Order Status Updated")
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }

    
}