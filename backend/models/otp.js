/* 
PROGRAM model/food_item - A mongoose schema module.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Defining essential structure of otp document stored in the database

USAGE: 
All active OTP will be stored as the following document, also the OTP will be hashed before saving.
*/

// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// const
const SALTLEN = 8;
const MAX_TRIAL = 3;

// schema
const OtpSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    otp: String,
    wrongTrial: { type: Number, default: 0 },
    expiresAt: Date,
  },
  { timestamps: true }
);

// listen save action and hash the password before saving
OtpSchema.pre("save", async function (next) {
  const otp = this;

  if (otp.isModified("otp")) {
    otp.otp = await bcrypt.hash(otp.otp, SALTLEN);
  }
  next();
});

const Otp = mongoose.model("Otp", OtpSchema);
module.exports = {
  Otp,
  MAX_TRIAL,
};
