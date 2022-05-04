/* 
PROGRAM model/customer - A mongoose schema module.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Defining essential structure of customer document stored in the database and providing fundamental middleware for customer.

MODULES:
jwt: Generate json token
mongoose: Establish connection to our database to store and retrieve data from.
bcrypt: Perform encryption on the password before saving into the database

USAGE: 
Define the structure of customer document stored in the mongodb database by mongosoe Schema. Also declared middleware to perform encryption before storing password into database, as well as generating customer token
*/


// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// bcrypt encryption dependencies
const SALTLEN = 8; 

//jwt dependencies
// const EXPIRE = 60 * 30; // 30 min
const EXPIRE = 60 * 60 * 24 * 30; // 1 month

//Defining the structure of customer document
const customerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, require: true },
    phoneNum: String,
    profilePic: Buffer,
    email: { type: String, required: true },
    points: { type: Number, default: 10 },
    lastLogin: Date,
    online: { type: Boolean, default: false }, // true: new token is needed as (old token expired) or (old token not expired but user logged out)
    activated: { type: Boolean, default: false },
    fav: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants",
      },
    ],
  },
  { timestamps: true }  //Providing the time of the last update and created date
);

// listen save action and hash the password before saving
customerSchema.pre("save", async function (next) {
  const customer = this;

  if (customer.isModified("password")) {
    customer.password = await bcrypt.hash(customer.password, SALTLEN);
  }
  next();
});

// instance method for generating jwt token
customerSchema.methods.genAuthToken = async function () {
  let customer = this;
  let token = jwt.sign(
    { _id: customer._id.toString(), usertype: "customer" },
    process.env.SECRET,
    { expiresIn: EXPIRE }
  );
  return token;
};

const Customers = mongoose.model("Customers", customerSchema);

//Export the Customer document stucture for other module to reference
module.exports = Customers;
