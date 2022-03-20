const Customers = require("../models/customer")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'takeiteasyf4';

const loginFetch = async (username, password) => {
    let customer = await Customers.findOne({username: username});
    if (customer == null) {
        console.log("no such user");
        throw new Error("user does not exist");
    }
    console.log("customer doc", customer);
    let matched = await bcrypt.compare(password, customer.password);
    console.log("compare result: ", matched);

    if (!matched) {
        console.log("key pair not match");
        throw new Error("401");
    }
    return customer;
}

module.exports = {
    signup : async (req, res) => {
        console.log("> register new accout");
        try {
            console.log(req.body);

            // create customer account
            let customer = await Customers.create(req.body);
            
            // generate token for enter home page
            let token = await customer.genAuthToken();

            res.status(201).send({token}); // 201: Created
        } 
        catch (err) {
            res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
        }
    },

    signin : async (req, res) => {
        console.log('> login to server');
        console.log(req.body); // username, pw
        try {
            console.log('now authenticate customer');

            // authenticate customer
            let customer = await loginFetch(req.body['username'], req.body['password']);
            console.log('authenticate successful, with user=', customer);

            // generate token for enter home page
            let token = await customer.genAuthToken();

            res.status(200).send({token}); // 200: OK
        }
        catch (err) {
            res.status(401).send(err) // 401: Unauthorized
        }
    }, 

    // middleware
    verifyToken : async (req, res, next) => {
        console.log("> get auth");
        try {
            let token = req.header('Authorization').replace('Bearer ', '');
            console.log("token: ", token);

            // decode playload
            console.log("ready to decode");
            let data = await jwt.verify(token, SECRET);
            console.log("decoded with decode: ", data);

            // check with db and pull out customer doc
            let customer = await Customers.findOne({_id : data._id})
            if (customer == null) {
                console.log("auth error");
                throw new Error("auth error");
            }
            console.log("customer doc", customer.username);
        
            next()
        }
        catch (err) {
            res.status(401).send(err); // 401: unauthorized
        }
        
    }
    
}