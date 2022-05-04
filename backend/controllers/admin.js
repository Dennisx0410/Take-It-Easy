/* 
PROGRAM admin - Controller of admin related request

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing functions for the server to respond to request

MODULES:
jwt: Generate json token

USAGE: 
After router route the request, all admin related request handling function is defined in this module. Generating corresponding respond, communicate with the database.
*/

// package
const jwt = require("jsonwebtoken");

// const
// const EXPIRE = 60 * 30; // 30 min
const EXPIRE = 60 * 60 * 24 * 30; // 1 month

//Function for authenticating admin
const authAdmin = async (username, password) => {
  //authenticate admin by username, password and return the admin doc if matched
  let isAdmin =
    username == process.env.ADMIN_USER && password == process.env.ADMIN_PW;
  if (!isAdmin) {
    //Throw an exception if user is not an admin who making the request
    throw { name: "UserNotFound", message: "admin credential not matched" };
  } else return isAdmin;
};

//Function for generating admin token upon admin login
const genAuthToken = async () => {
  let token = jwt.sign({ _id: 3100, usertype: "admin" }, process.env.SECRET, {
    expiresIn: EXPIRE,
  });
  return token;
};

//Export Functions for other module to reference (Mainly for Router) 
module.exports = {
  //Admin login function
  login: async (req, res) => {
    try {
      // authenticate admin, try to match authorize admin by utilizing the authAdmin function defined in this module
      await authAdmin(req.body.username, req.body.password);

      // generate token for enter home page
      let token = await genAuthToken();

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      res.status(401).send(err); // 401: Unauthorized
    }
  },
};
