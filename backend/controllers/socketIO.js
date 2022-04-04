const jwt = require('jsonwebtoken');
const cust = require('./customer');

//Socket.IO Setup on port 8080
const io = require("socket.io")(8080, {cors:{
    origin: ["http://localhost:3000"],
    },
})

var onlineCustomer = []

const pairCustomerID = async (socketId, user_id) =>{
    let user = await cust.getCustomerById(user_id)
    let username = user.username
    const customer = {socketId, username}
    onlineCustomer.push(customer)
    console.log(` >>> Paired ${username} with `, socketId)
}

const findSocketIdWithUsername = (username) =>{
    const index = onlineCustomer.findIndex((customer)=>
            customer.username === username
        )
        return index
}



io.on("connection", socket =>{
    console.log("> Socket.IO: Recieved Connection from client with ID", socket.id, " With username", socket.handshake.query.token)

    let token = socket.handshake.query.token
    let data = jwt.verify(token, process.env.SECRET)
    if (data.usertype == 'customer'){
        pairCustomerID(socket.id, data._id)
    }


    socket.on("disconnect", () =>{
        const index = onlineCustomer.findIndex((customer)=>
            customer.socketId === socket.id
        )
        if (index !== -1){
            console.log(` >>> Remove Key Pair for ${onlineCustomer[index].socketId} with socket ${onlineCustomer[index].username}`)
            onlineCustomer.splice(index, 1)[0]
        }
    })
})



module.exports = {
    notifyAll: (doc) =>{
        io.emit("notification", doc)
        console.log("> Real Time Notification Sent")
    },
    
    notifySingle: (username, doc) =>{
        let index = findSocketIdWithUsername(username)
        if (index != -1){
            console.log(`Sent notification to ${username} with socket ID ${onlineCustomer[index].socketId}`)
            io.to(onlineCustomer[index].socketId).emit('notification', doc)
        }
    }
}