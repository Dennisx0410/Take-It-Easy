/* 
PROGRAM model/food_item - A mongoose schema module.

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Defining essential structure of food item document stored in the database

USAGE: 
Define the structure of food item document stored in the mongodb database by mongosoe Schema.
*/

// packages
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Structure of food item document
const foodItemsSchema = new Schema({
  picture: Buffer,
  name: String,
  style: String,
  price: Number,
});

const FoodItems = mongoose.model("FoodItems", foodItemsSchema);
//Export the structure to other module to reference
module.exports = FoodItems;
