// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema
const restaurantSchema = new Schema({
    restaurantID : Number,
    username : String,
    restaurantName : String,
    password : String,
    phoneNum : String,
    profilePicture : String,
    address : String,
    licenseNum : String,
    menu : [Object]
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
    let token = jwt.sign({_id: restaurant._id.toString()}, process.env.SECRET, {expiresIn: EXPIRE});
    console.log('> generated token');
    return token;
  }

const Restaurants = mongoose.model('Restaurants', restaurantSchema);
module.exports = Restaurants;