// package
const jwt = require("jsonwebtoken");
const cust = require("./customer");
const rest = require("./restaurant");

module.exports = {
  // middleware for token verification
  verifyToken: async (req, res, next) => {
    // TODO: verify token by matching docs in db
    try {
      // extract token
      let token = req.header("Authorization").replace("Bearer ", "");

      // decode playload
      let data = jwt.verify(token, process.env.SECRET);
      let usertype = data.usertype;

      let user;
      try {
        if (usertype == "customer") {
          // customer
          // check with db and pull out customer doc
          user = await cust.getCustomerById(data._id);
        } else if (usertype == "restaurant") {
          // restaurant
          // check with db and pull out restaurant doc
          user = await rest.getRestaurantById(data._id);
        } else if (usertype == "admin") {
          // admin
          req.token = token;
          return next();
        } else {
          // other user type
          throw { name: "UsertypeError", message: "wrong user type" };
        }
      } catch (err) {
        if (err.name == "UserNotExist") {
          throw { name: "VerifyError", message: "unable to find user" };
        }
      }

      // check user currently logging in
      if (!user.online) {
        throw {
          name: "InactiveUserRequest",
          message: `${usertype} request token verification but his is not logging in`,
        };
      }

      // pass to next middleware/function
      req.token = token;
      req[`${usertype}`] = user;

      next();
    } catch (err) {
      res.status(401).send(err); // 401: unauthorized
    }
  },
};
