require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const bodyParser = require('body-parser');
const app = express();

app.use(express.json())

// routers
const customerRouter = require('./routers/customer');
const restaurantRouter = require('./routers/restaurant');
const adminRouter = require('./routers/admin');
const orderRouter = require('./routers/order');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

// routers
app.use('/customer', customerRouter);
app.use('/restaurant', restaurantRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);

const CONNECTION_URL = "mongodb+srv://User:1234@cluster0.yjmpv.mongodb.net/TakeItEasy?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, () => console.log('Server running on port ' + PORT)))
.catch((err) => console.log(err));

// all unrouted routes
app.all("/*", (req, res) => {
    res.status(403).send({});
})

//Socket.IO Setup on port 8080
const io = require("socket.io")(8080, {cors:{
    origin: ["http://localhost:3000"],
    },
})

io.on("connection", socket =>{
    console.log("> Socket.IO: Recieved Connection from client with ID", socket.id, " With Token", socket.handshake.query.token)
})