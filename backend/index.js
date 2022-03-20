const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
// const request = require("request")
const app = express();

app.use(express.json())

// routers
const loginRoutes = require('./routers/login');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

// routers
app.use('/login', loginRoutes);

const CONNECTION_URL = "mongodb+srv://User:1234@cluster0.yjmpv.mongodb.net/TakeItEasy?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology: true})
.then(()=> app.listen(PORT, () => console.log('Server running on port ' + PORT)))
.catch((err) => console.log(err));


const loginController = require('./controllers/login');

// perform auth pefore every action
app.post('/dosth', loginController.verifyToken, (req, res) => {
    res.send("do sth");
});

// all unrouted routes
app.all("/*", (req, res) => {
    res.send("Welcome to Take It Easy");
})
