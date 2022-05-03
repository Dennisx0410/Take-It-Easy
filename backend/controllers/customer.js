// model
const Customers = require("../models/customer");
const Otp = require("../models/otp").Otp;

// package
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sharp = require("sharp");

// const
const { MAX_TRIAL } = require("../models/otp");
const MAX_RESIZE_PX = 2000; // 2000 pixel
const MAX_FILESIZE = 5 * 1024 * 1024; // 5MB

// handle for image upload
const upload = multer({
  limits: { fileSize: MAX_FILESIZE }, 
  fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      // jpg, jpeg, jfif are udner image/jpeg
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const authCustomer = async (username, password) => {
  // TODO: authenticate customer by username, password and return the customer doc if matched
  // fetch user by username
  let customer = await Customers.findOne({ username });
  if (customer == null) {
    throw { name: "UserNotFound", message: "User does not exist" };
  }

  // check if password matched
  let matched = await bcrypt.compare(password, customer.password);
  if (!matched) {
    throw { name: "InvalidPassword", message: "Invalid password" };
  }

  return customer;
};

const getCustomerByUsername = async (username) => {
  // TODO: get customer by username
  let customer = await Customers.findOne({ username });
  if (customer == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }

  return customer;
};

const getCustomerById = async (id) => {
  // TODO: get customer by id
  let customer = await Customers.findOne({ _id: id });
  if (customer == null) {
    throw { name: "UserNotExist", message: "User does not exist" };
  }

  return customer;
};

const getCustomers = async () => {
  // TODO: get all customers
  let customers = await Customers.find();
  return customers;
};

module.exports = {
  getCustomerData: async (req, res) => {
    // TODO: return customer data
    res.send({
      userID: req.customer._id,
      username: req.customer.username,
      phoneNum: req.customer.phoneNum,
      email: req.customer.email,
      points: req.customer.points,
      profilePic: req.customer.profilePic,
    });
  },

  getCustomerById: getCustomerById,

  getCustomerByUsername: getCustomerByUsername,

  getAllCustomerData: async (req, res) => {
    // TODO: get all customers
    try {
      let customers = await getCustomers();
      res.send(customers);
    } catch (err) {
      res.send(err);
    }
  },

  // middleware for new user login
  addCustomer: async (req, res, next) => {
    // TODO : Add Customer to database (Register) by credentials
    try {
      // check user with same username already exists
      let customer = await Customers.findOne({ username: req.body.username });

      if (customer) {
        // already exists
        throw {
          name: "UserAlreadyExisted",
          message: "User with same username already registed",
        };
      }

      // create customer account

      customer = await Customers.create(req.body);

      req.customer = customer;
      req.accStatus = "SignupSuccess";

      // continue to set profile pic
      next();
    } catch (err) {
      res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
    }
  },

  changePw: async (req, res) => {
    // TODO: change pw given old and new password pair (request by user)
    try {
      let passwordOld = req.body.passwordOld;
      let passwordNew = req.body.passwordNew;
      let customer = req.customer;

      // check if old pw matched
      let matched = await bcrypt.compare(passwordOld, customer.password);
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

      customer.password = passwordNew;
      await customer.save();

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

  resetPw: async (req, res) => {
    // TODO: change pw given username (request by admin)
    try {
      let passwordNew = req.body.passwordNew;

      let customer = await getCustomerByUsername(req.body.username);

      // check if new pw is longer than 8 characters
      if (passwordNew.length < 8) {
        throw {
          name: "LengthTooShort",
          message: "Password length should be greater than 8",
        };
      }

      customer.password = passwordNew;
      await customer.save();

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
              name: "FileError",
              message: "image should be jpg or png and smaller than 5MB",
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
      // resize profile pic to MAX_RESIZE_PX before storing to db
      let resizedBuf = await sharp(req.file.buffer)
        .resize({
          width: MAX_RESIZE_PX,
          height: MAX_RESIZE_PX
        })
        .toBuffer();
      req.customer.profilePic = resizedBuf;
      await req.customer.save();

      next();
    } catch (err) {
      res.send(err);
    }
  },

  getProfilePic: async (req, res) => {
    // TODO: view profile image
    try {
      res.send(req.customer.profilePic);
    } catch (err) {
      res.send(err);
    }
  },

  // middleware
  verifyOTP: async (req, res, next) => {
    // TODO: verify the OTP with db before activating account
    try {
      // already activated
      let customer = await getCustomerByUsername(req.body.username);
      if (customer.activated) {
        throw {
          name: "AlreadyActivated",
          message: "Account already activated",
        };
      }

      // OTP not exists in db
      let otpContainer = await Otp.findOne({ username: req.body.username });
      if (otpContainer == null) {
        throw {
          name: "OtpNotFound",
          message: "User did not sent account verification request",
        };
      }

      // check otp expired
      if (otpContainer.expiresAt < new Date()) {
        throw {
          name: "OtpExpired",
          message: "OTP expired, please send request to generate OTP again",
        };
      }

      // check if the same user having too much wrong trials (3 times)
      if (otpContainer.wrongTrial >= MAX_TRIAL) {
        throw {
          name: "TooMuchTrials",
          message:
            "User entered too much wrong trials, please send request to generate OTP again",
        };
      }

      // check if otp match
      let matched = await bcrypt.compare(req.body.otp, otpContainer.otp);
      if (!matched) {
        // add one trial
        otpContainer.wrongTrial += 1;
        otpContainer.save();
        throw { name: "InvalidOtp", message: "Invalid OTP" };
      }

      // delete OTP when success
      await Otp.deleteOne({ username: req.body.username });

      next();
    } catch (err) {
      res.status(400).send(err);
    }
  },

  activateAccount: async (req, res) => {
    // TODO: activate account after verifying OTP

    try {
      let customer = await getCustomerByUsername(req.body.username);

      // activated with first login
      // generate token for enter home page
      let token = await customer.genAuthToken();

      // update last login
      customer.lastLogin = new Date();
      customer.activated = true;
      customer.online = true;
      await customer.save();

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      res.status(403).send(err);
    }
  },

  login: async (req, res, next) => {
    // TODO: login user by username, password
    try {
      // authenticate customer
      let customer = await authCustomer(req.body.username, req.body.password);

      // check account if activated
      if (customer.activated == false) {
        // user created account but not activated
        req.accStatus = "AccountNotActivated";

        // go to send verify email
        return next();
        // throw {name: 'AccountNotActivated', message: 'account not activated'};
      }

      // generate token for enter home page
      let token = await customer.genAuthToken();

      // update last login
      customer.lastLogin = new Date();
      customer.online = true;
      await customer.save();

      res.status(200).send({ token }); // 200: OK
    } catch (err) {
      res.status(401).send(err); // 401: Unauthorized
    }
  },

  logout: async (req, res) => {
    // TODO: logout customer after token verification
    try {
      // update active status
      req.customer.online = false;
      await req.customer.save();
      res
        .status(200)
        .send({ name: "SuccessfullyLogout", message: "Successfully logout" });
    } catch (err) {
      res.send(err);
    }
  },
};
