const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const foodItemsSchema = new Schema({
    picture : String,
    name : String,
    price : Number
});

const FoodItems = mongoose.model('FoodItems', foodItemsSchema);
module.exports = FoodItems;