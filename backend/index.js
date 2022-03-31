require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const bodyParser = require('body-parser');
const app = express();

app.use(express.json())

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

const CONNECTION_URL = "mongodb+srv://User:1234@cluster0.yjmpv.mongodb.net/TakeItEasy?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, () => console.log('Server running on port ' + PORT)))
.catch((err) => console.log(err));

// all unrouted routes
app.all("/*", (req, res) => {
    res.status(403).send({});
})
