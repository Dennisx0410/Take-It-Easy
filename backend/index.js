/* 
PROGRAM index - Main Program of the whole backend server.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Hosting the Rest-API server using express.js, providing response for incoming request.

MODULES:
dotenv: Allow environment variable to be used across the main program, enhance the overall security of the server. As the database link and admin credentials are not contain or pushed to github.
express: Using the express.js as our main server framework.
mongoose: Establish connection to our database to store and retrieve data from.
cors: allowing cross origin resource sharing.

USAGE: 
Utilizing router feature to futher modulize the overall structure of the server. Router route request by their URL to corresponding router to further handle the requst. Also, hosting the server on port specific in the environment variable or as default 5000. When the server is started, a connection to the database is established.
*/

//Main Modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bodyParser = require("body-parser");
const app = express();

app.use(express.json());

//Require routers
const customerRouter = require("./routers/customer");
const restaurantRouter = require("./routers/restaurant");
const adminRouter = require("./routers/admin");
const orderRouter = require("./routers/order");
const notificationRouter = require("./routers/notification");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//Route requests to respective router
app.use("/customer", customerRouter);
app.use("/restaurant", restaurantRouter);
app.use("/admin", adminRouter);
app.use("/order", orderRouter);
app.use("/notification", notificationRouter);

//Hosting URL
const CONNECTION_URL = process.env.DB_URL;

//Hosting Port
const PORT = process.env.PORT || 5000;

//Connect to mongodb
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log("Server running on port " + PORT))
  )
  .catch((err) => console.log(err));
