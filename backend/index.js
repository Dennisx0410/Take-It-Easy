var express = require('express');
var mongoose = require("mongoose");
var cors = require("cors");
var request = require("request")
const app = express();

const CONNECTION_URL = "mongodb+srv://User:1234@cluster0.yjmpv.mongodb.net/TakeItEasy?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, () => console.log('Server running on port ' + PORT)))
.catch((err) => console.log(err));