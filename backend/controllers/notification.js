const Notification = require('../models/notification')
const socketio = require('./socketIO')

module.exports = {
    globalNoti: async (req, res) => {
        console.log("> Creating Global Notification") //For Admin Boardcasting Notification to Everyone
        try {
            let noti = {};
            noti.sender = "Administrator"
            noti.message = req.body.message
            noti = await Notification.create(noti)
            console.log("> Created new noti ", noti)
            socketio.notifyAll(noti)
            res.status(201).send(noti)
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    //Testing Fetching all notification
    fetchAll: async (req, res) => {
        try {
            let noti = await Notification.find({}).sort({createdAt: -1})
            res.status(200).send(noti)
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    targetedNoti: async (req,res) =>{
        try {
            let noti = {};
            noti.reciever = "user1"
            noti.sender = "Administrator"
            noti.message = req.body.message
            noti = await Notification.create(noti)
            console.log("> Created new targeted noti to ",noti.reciever)
            socketio.notifySingle(noti.reciever, noti)
            res.status(201).send(noti)
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}