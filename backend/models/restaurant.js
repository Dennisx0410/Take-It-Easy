// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SALTLEN = 10;
const EXPIRE = 60 * 30; // 30 min

// schema
const restaurantSchema = new Schema({
    username : String,
    restaurantName : String,
    password : String,
    phoneNum : String,
    profilePic : Buffer,
    address : String,
    licenseNum : String,
    activated : {type : Boolean, default : false},
    online: {type : Boolean, default: false},
    menu : [mongoose.Types.ObjectId]
});

restaurantSchema.pre('save', async function (next) {
    console.log('save action detected, check changes');
    const restaurant = this;
  
    // console.log('orig pw: ', restaurant.password);
  
    if (restaurant.isModified('password')) {
      console.log('password changed, hash before saving');
      restaurant.password = await bcrypt.hash(restaurant.password, SALTLEN);
    }
    next();
  })
  
  // instance method for generating jwt token
  restaurantSchema.methods.genAuthToken = async function () {
    console.log('> generating auth token');
    let restaurant = this;
    // assume never expire
    // let token = jwt.sign({_id: restaurant._id.toString()}, process.env.SECRET);
    let token = jwt.sign({_id: restaurant._id.toString(), userType: 'restaurant'}, process.env.SECRET, {expiresIn: EXPIRE});
    console.log('> generated token');
    return token;
  }

const Restaurants = mongoose.model('Restaurants', restaurantSchema);
module.exports = Restaurants;