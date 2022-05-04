/* 
PROGRAM model/order - A mongoose schema module.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Defining essential structure of order document stored in the database

USAGE: 
Define the structure of order document stored in the mongodb database by mongosoe Schema.
*/

// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

//Struture of order document
const orderSchema = new Schema(
  {
    customerID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Customers",
    },
    restaurantID: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Restaurants",
    },
    items: [{ type: mongoose.Types.ObjectId, ref: "FoodItems" }],
    total: Number,
    netTotal: Number,
    couponUsed: Number,
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//Import plugin for auto increment
orderSchema.plugin(AutoIncrement, { inc_field: "orderNo" });

const Orders = mongoose.model("Orders", orderSchema);
//Export the structure of order for other module.
module.exports = Orders;
