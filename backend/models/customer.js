// packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const
const SALTLEN = 8;
const EXPIRE = 60 * 30; // 30 min

const customerSchema = new Schema({
    username : {
      type: String, 
      required: true,
      unique: true
    },
    password : {type: String, require: true},
    phoneNum : String,
    profilePic : Buffer,
    email : {type: String, required: true},
    point : Number,
    lastLogin : Date,
    online : {type: Boolean, default: false}, // true: new token is needed as (old token expired) or (old token not expired but user logged out)
    activated: {type: Boolean, default: false}
}, {timestamps: true});

// listen save action and hash the password before saving
customerSchema.pre('save', async function (next) {
  console.log('save action detected, check changes');
  const customer = this;

  // console.log('orig pw: ', customer.password);

  if (customer.isModified('password')) {
    console.log('password changed, hash before saving');
    customer.password = await bcrypt.hash(customer.password, SALTLEN);
  }
  next();
})

// instance method for generating jwt token
customerSchema.methods.genAuthToken = async function () {
  console.log('generating auth token');
  let customer = this;
  // assume never expire
  // let token = jwt.sign({_id: customer._id.toString()}, process.env.SECRET);
  let token = jwt.sign({_id: customer._id.toString()}, process.env.SECRET, {expiresIn: EXPIRE});
  console.log('generating done');
  return token;
}

const Customers = mongoose.model('Customers', customerSchema);
module.exports = Customers;