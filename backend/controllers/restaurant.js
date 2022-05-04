/* 
PROGRAM restaurant - Controller of restaurant related functionality

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing functions for the server to handle restaurant related request and provide respond

MODULES:
socketio: Enable real time communication between server and client

USAGE: 
Exporting restaurant function to other module. Handling the routed request under /restaurant domain
*/

// model
const Restaurants = require("../models/restaurant.js");
const foodItem = require("../models/food_item.js");

// package
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sharp = require("sharp");

// const
const MAX_RESIZE_PX = 2000; // 2000 pixel
const MAX_FILESIZE = 5 * 1024 * 1024; // 5MB

// handle for image upload
const upload = multer({
  limits: { fileSize: MAX_FILESIZE }, // 5MB
  fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      // jpg, jpeg, jfif are udner image/jpeg
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

//Function for authenticating restaurant
const authRestaurant = async (username, password) => {

  // fetch restaurant by username
  let restaurant = await Restaurants.findOne({ username });
  if (restaurant == null) {
    throw { name: "UserNotFound", message: "User does not exist" };
  }

  // check if password matched
  let matched = await bcrypt.compare(password, restaurant.password);
  if (!matched) {
    throw { name: "InvalidPassword", message: "Invalid password" };
  }

  return restaurant;
};

const getRestaurantByUsername = async (username) => {
  // TODO: get restaurant by username
  let restaurant = await Restaurants.findOne({ username });
  if (restaurant == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }

  return restaurant;
};

const getRestaurantById = async (id) => {
  // TODO: get restaurant by id
  let restaurant = await Restaurants.findOne({ _id: id });
  if (restaurant == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }

  return restaurant;
};

//Export function for other module to use
module.exports = {
  getRestaurantById: getRestaurantById,

  getRestaurantByUsername: getRestaurantByUsername,

  //Function for getting a single restaurant data by restaurant object id
  getRestaurantData: async (req, res) => {
    try {
      // fetch restaurant by username
      const data = await Restaurants.findOne({
        _id: req.restaurant._id,
      })
      //Populate menu to provide more detail on the food item
      .populate("menu");
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send(err);
    }
  },

  //Function to fetch all restaurant waiting for approval
  getNotApprovedRestaurant: async (req, res) => {
    try {
      //Populate menu to provide more detail on the food item
      let list = await Restaurants.find({ approved: false }).populate("menu");

      res.status(200).send(list);
    } catch (err) {
      res.status(404).send(err);
    }
  },

  //Function for fetching all approved restaurant
  getApprovedRestaurant: async (req, res) => {
    try {
      //Populate menu to provide more detail on the food item
      let list = await Restaurants.find({ approved: true }).populate("menu");
      res.status(200).send(list);
    } catch (err) {
      res.status(404).send(err);
    }
  },

  //Function for fetching all restaurant data, no matter it is approved or waiting for approval
  getAllRestaurantData: async (req, res) => {
    try {
      //Populate menu to provide more detail on the food item
      let data = await Restaurants.find().populate("menu");
      res.status(200).send(data);
    } catch (err) {
      res.status(404).send(err);
    }
  },

  // middleware for new user login
  addRestaurant: async (req, res, next) => {
    try {
      let restaurant = await Restaurants.findOne({
        username: req.body.username,
      });

      if (restaurant) {
        // already exists
        throw {
          name: "UserAlreadyExisted",
          message: "User with same username already registed",
        };
      }

      // create restaurant account
      restaurant = await Restaurants.create(req.body);

      req.restaurant = restaurant;

      // continue to set profile pic
      next();
    } catch (err) {
      res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
    }
  },

  //Function for handling restaurant change password
  changePw: async (req, res) => {
    try {
      let passwordOld = req.body.passwordOld;
      let passwordNew = req.body.passwordNew;
      let restaurant = req.restaurant;

      // check if old pw matched
      let matched = await bcrypt.compare(passwordOld, restaurant.password);
      if (!matched) {
        throw { name: "InvalidPassword", message: "Invalid password" };
      }

      // check if new pw same as old pw
      if (passwordOld === passwordNew) {
        throw {
          name: "DuplicatedNewPassword",
          message: "New password is same as the old password",
        };
      }

      // check if new pw is longer than 8 characters
      if (passwordNew.length < 8) {
        throw {
          name: "LengthTooShort",
          message: "Password length should be greater than 8",
        };
      }

      restaurant.password = passwordNew;
      await restaurant.save();

      // continue to set profile pic
      res
        .status(200)
        .send({
          name: "SuccessfullyChangedPassword",
          message: "Successfully changed password",
        });
    } catch (err) {
      res.send(err);
    }
  },

  //Function for handle admin request of resetting password of restaurant
  resetPw: async (req, res) => {

    try {
      let passwordNew = req.body.passwordNew;

      let restaurant = await getRestaurantByUsername(req.body.username);

      // check if new pw is longer than 8 characters
      if (passwordNew.length < 8) {
        throw {
          name: "LengthTooShort",
          message: "Password length should be greater than 8",
        };
      }

      restaurant.password = passwordNew;
      await restaurant.save();

      // continue to set profile pic
      res
        .status(200)
        .send({
          name: "SuccessfullyResetPassword",
          message: "Successfully reset password",
        });
    } catch (err) {
      res.send(err);
    }
  },

  // middleware
  uploadProfilePic: async (req, res, next) => {
    // TODO: upload profile image with key = 'profile' to server
    try {
      return upload.single("profile")(req, res, () => {
        if (!req.file) {
          return res
            .status(400)
            .send({
              name: "FileExtensionError",
              message: "image should be jpg or png",
            });
        } else {
        }

        // continue to set store profile pic
        next();
      });
    } catch (err) {
      res.send(err);
    }
  },

  // middleware
  setProfilePic: async (req, res, next) => {
    // TODO: add profile pic to db
    try {
      // resize profile pic to 100x100px before storing to db
      let resizedBuf = await sharp(req.file.buffer)
        .resize({
          width: 500,
          height: 500,
        })
        .toBuffer();
      req.restaurant.profilePic = resizedBuf;
      await req.restaurant.save();

      next();
    } catch (err) {
      res.send(err);
    }
  },

  getProfilePic: async (req, res) => {
    // TODO: view profile image
    try {
      res.send(req.restaurant.profilePic);
    } catch (err) {
      res.send(err);
    }
  },

  //Function for handling restaurant login
  login: async (req, res) => {
    try {
      // authenticate restaurant
      let restaurant = await authRestaurant(
        req.body.username,
        req.body.password
      );

      // check account if approved
      if (restaurant.approved == false) {
        // user created account but not approved
        throw { name: "AccountNotApproved", message: "account not approved" };
      }

      // generate token for enter home page
      let token = await restaurant.genAuthToken();

      restaurant.online = true;
      await restaurant.save();

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      res.status(401).send(err); // 401: Unauthorized
    }
  },

  //Function for handling restaurant logout
  logout: async (req, res) => {
    // TODO: logout restaurant after token verification
    try {
      req.restaurant.online = false;
      await req.restaurant.save();
      res
        .status(200)
        .send({ name: "SuccessfullyLogout", message: "Successfully logout" });
    } catch (err) {
      res.send(err);
    }
  },

  //Function for approving a restaurant by the admin
  approveAccount: async (req, res, next) => {

    try {
      let restaurant = await getRestaurantByUsername(req.body.username);

      // check if already approved
      if (restaurant.approved) {
        throw { name: "AlreadyApproved", message: "Account already activated" };
      }

      // approve account
      restaurant.approved = true;
      await restaurant.save();

      req.accStatus = "AccountApproved";
      req.restaurant = restaurant;

      // res.status(200).send({msg:"Account approved"}); // 200: OK
      // continue to send email notify restaurant
      next();
    } catch (err) {
      res.status(403).send(err);
    }
  },

  //Function for the admin to reject an restaurant account
  rejectAccount: async (req, res, next) => {
    try {
      let restaurant = await getRestaurantByUsername(req.body.username);

      req.accStatus = "AccountRejected";
      req.restaurant = restaurant;
      await Restaurants.deleteOne({ username: req.body.username });

      // continue to send email notify restaurant
      next();
    } catch (err) {
      res.status(403).send(err);
    }
  },

  // Food Related Function
  //Functino for handling a food item image upload
  uploadFoodItemPic: async (req, res, next) => {
    // TODO: upload profile image with key = 'foodPic' to server
    try {
      return upload.single("foodPic")(req, res, () => {
        if (!req.file) {
          return res
            .status(400)
            .send({
              name: "FileExtensionError",
              message: "image should be jpg or png",
            });
        } else {
        }

        // continue to set store Food Item pic
        next();
      });
    } catch (err) {
      res.send(err);
    }
  },
  //Function for handling a new addition of food item
  addFoodItem: async (req, res) => {
    try {
      // resize Food Item pic to MAX_RESIZE_PX before storing to db
      let resizedBuf = await sharp(req.file.buffer)
        .resize({
          width: MAX_RESIZE_PX,
          height: MAX_RESIZE_PX
        })
        .toBuffer();
      //Create a new food item document
      let doc = new foodItem();
      doc.picture = resizedBuf;
      doc.name = req.body.name;
      doc.price = req.body.price;
      doc.style = req.body.style;
      //Save to db
      doc = await foodItem.create(doc);
      //Push the newly created food item into restaurant menu
      req.restaurant.menu.push(doc._id);
      //Commit the changes
      await req.restaurant.save();
      res.send({
        name: "AddedFoodItemSuccessfully",
        message: "Added food item successfully",
      });
    } catch (err) {
      res.send(err);
    }
  },

  //Function for handling a removal of a food item for menu
  removeFoodItem: async (req, res) => {
    try {
      //Finding the index of the food item in the restaurant menu array
      let idx = req.restaurant.menu.indexOf(req.body.foodId);
      if (idx == -1) {
        throw { name: "FoodNotFound", message: "food is not exist in menu" };
      }
      //Remove the element from the array
      req.restaurant.menu.splice(idx, 1);
      //Commit the changes
      await req.restaurant.save();
      //Delete the food item from food item collection
      await foodItem.deleteOne({ _id: req.body.foodId });
      res.send({
        name: "RemovedFoodItemSuccessfully",
        message: "Removed food item successfully",
      });
    } catch (err) {
      res.send(err);
    }
  },
};
