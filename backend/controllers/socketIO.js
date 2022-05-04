/* 
PROGRAM socketIO - SocketIO related functionality

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing real-time communicate functions between server and user

MODULES:
socketio: Enable real time communication between server and client
jwt: for token authentication

USAGE: 
Exporting socketio function to other module.
*/

const jwt = require("jsonwebtoken");
const cust = require("./customer");
const rest = require("./restaurant");

//Socket.IO Setup on port 8080
const io = require("socket.io")(8080, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

//Array storing online customers
var onlineCustomer = [];
//Array storing online restaurants
var onlineRestaurant = [];


//Function for pairing customer username with the socketio client id upon connection
const pairCustomerID = async (socketId, user_id) => {
  let user = await cust.getCustomerById(user_id);
  let username = user.username;
  //Create a new key pair
  const customer = { socketId, username };
  //Push the new key pair into the array
  onlineCustomer.push(customer);
};

//Function for finding socketio client id with their customer username
const findSocketIdWithUsername = (username) => {
  const index = onlineCustomer.findIndex(
    (customer) => customer.username === username
  );
  return index;
};

//Function for pairing restaurant username with the socketio client id upon connection
const pairRestaurantID = async (socketId, rest_id) => {
  let user = await rest.getRestaurantById(rest_id);
  let username = user.username;
  const restaurant = { socketId, username };
  onlineRestaurant.push(restaurant);
};

//Function for finding socketio client id with their restaurant username
const findSocketIdWithRestaurantUsername = (username) => {
  const index = onlineRestaurant.findIndex(
    (restaurant) => restaurant.username === username
  );
  return index;
};

//Set event listen on connection, execute the following when new connection recieved
io.on("connection", (socket) => {
  //Fetch the token in the handshake
  let token = socket.handshake.query.token;
  //Verify the token if it is valid
  let data = jwt.verify(token, process.env.SECRET);
  //Pair corresponding
  if (data.usertype == "customer") {
    pairCustomerID(socket.id, data._id);
  } else if (data.usertype == "restaurant") {
    pairRestaurantID(socket.id, data._id);
  }
  //Add a event listener to listen upon client disconnect from server
  socket.on("disconnect", async () => {
    var index = -1;
    //Upon disconnect, remove them from online list
    if (data.usertype == "customer") {
      index = onlineCustomer.findIndex(
        (customer) => customer.socketId === socket.id
      );
      if (index !== -1) {
        onlineCustomer.splice(index, 1)[0];
      }
    } else if (data.usertype == "restaurant") {
      index = onlineRestaurant.findIndex(
        (restaurant) => restaurant.socketId === socket.id
      );

      if (index !== -1) {
        onlineRestaurant.splice(index, 1)[0];
      }
    }
  });
});

module.exports = {
  //Function for creating a global notification, for admin
  notifyAll: (doc) => {
    io.emit("notification", doc);
  },

  //Functino for sending a targeted notification
  notifySingle: (username, usertype, doc) => {
    let index = -1;
    if (usertype == "customer") {
      index = findSocketIdWithUsername(username);
      if (index != -1) {
        io.to(onlineCustomer[index].socketId).emit("notification", doc);
      }
    } else if (usertype == "restaurant") {
      index = findSocketIdWithRestaurantUsername(username);
      if (index != -1) {
        io.to(onlineRestaurant[index].socketId).emit("notification", doc);
      }
    }
  },
  //Function for instant updating order list of restaurant upon new order creation
  sendOrder: (username, doc) => {
    let index = -1;
    index = findSocketIdWithRestaurantUsername(username);
    if (index != -1) {
      io.to(onlineRestaurant[index].socketId).emit("recieveOrder", doc);
    }
  },
};
