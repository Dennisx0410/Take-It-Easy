const jwt = require("jsonwebtoken");
const cust = require("./customer");
const rest = require("./restaurant");

//Socket.IO Setup on port 8080
const io = require("socket.io")(8080, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

var onlineCustomer = [];
var onlineRestaurant = [];

const pairCustomerID = async (socketId, user_id) => {
  let user = await cust.getCustomerById(user_id);
  let username = user.username;
  const customer = { socketId, username };
  onlineCustomer.push(customer);
};

const findSocketIdWithUsername = (username) => {
  const index = onlineCustomer.findIndex(
    (customer) => customer.username === username
  );
  return index;
};

const pairRestaurantID = async (socketId, rest_id) => {
  let user = await rest.getRestaurantById(rest_id);
  let username = user.username;
  const restaurant = { socketId, username };
  onlineRestaurant.push(restaurant);
};

const findSocketIdWithRestaurantUsername = (username) => {
  const index = onlineRestaurant.findIndex(
    (restaurant) => restaurant.username === username
  );
  return index;
};

io.on("connection", (socket) => {
  let token = socket.handshake.query.token;
  let data = jwt.verify(token, process.env.SECRET);
  if (data.usertype == "customer") {
    pairCustomerID(socket.id, data._id);
  } else if (data.usertype == "restaurant") {
    pairRestaurantID(socket.id, data._id);
  }

  socket.on("disconnect", async () => {
    var index = -1;
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
  notifyAll: (doc) => {
    io.emit("notification", doc);
  },

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

  sendOrder: (username, doc) => {
    let index = -1;
    index = findSocketIdWithRestaurantUsername(username);
    if (index != -1) {
      io.to(onlineRestaurant[index].socketId).emit("recieveOrder", doc);
    }
  },
};
