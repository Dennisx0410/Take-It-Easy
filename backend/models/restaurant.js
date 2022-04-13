// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SALTLEN = 10;
// const EXPIRE = 60 * 30; // 30 min
const EXPIRE = 60 * 60 * 24 * 30; // 1 month

// schema
const restaurantSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  password: { type: String, require: true },
  email: { type: String, required: true },
  phoneNum: String,
  profilePic: Buffer,
  address: String,
  licenseNum: String,
  approved: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  // menu : [mongoose.Types.ObjectId]
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItems",
    },
  ],
});

restaurantSchema.pre("save", async function (next) {
  const restaurant = this;

  if (restaurant.isModified("password")) {
    restaurant.password = await bcrypt.hash(restaurant.password, SALTLEN);
  }
  next();
});

// instance method for generating jwt token
restaurantSchema.methods.genAuthToken = async function () {
  let restaurant = this;
  let token = jwt.sign(
    { _id: restaurant._id.toString(), usertype: "restaurant" },
    process.env.SECRET,
    { expiresIn: EXPIRE }
  );
  return token;
};

const Restaurants = mongoose.model("Restaurants", restaurantSchema);
module.exports = Restaurants;
