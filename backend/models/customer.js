const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'takeiteasyf4';
const SALTLEN = 8;
const EXPIRE = 60 * 30; // 30 min

const customerSchema = new Schema({
    // memberID : Number,
    username : {
      type: String, 
      required: true,
      unique: true
    },
    password : {type: String, require: true},
    phoneNum : String,
    profilePic : String,
    email : {type: String, required: true},
    point : Number,
    // registerDate : Date,
}, { timestamps: true});

// listen save action and hash the password before saving
customerSchema.pre('save', async function (next) {
  console.log('save action detected, check changes');
  const customer = this;

  console.log('orig pw: ', customer.password);

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
  let token = jwt.sign({_id: customer._id.toString()}, SECRET, {expiresIn: EXPIRE});
  console.log('generating done');
  return token;
}

const Customers = mongoose.model('Customers', customerSchema);
module.exports = Customers;