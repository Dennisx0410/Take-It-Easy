const Customers = require("../models/customer")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const SECRET = 'takeiteasyf4';

// handle for image upload
const upload = multer({
    limits: {fileSize: 3 * 1024 * 1024}, // 3MB
    fileFilter(req, file, cb) {
        console.log('file info:', file)
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
});

const authCustomer = async (username, password) => {
    // TODO: authenticate customer by username, password and return the customer doc if matched

    // fetch user by username
    let customer = await Customers.findOne({username});
    if (customer == null) {
        throw {name : 'UserNotExist', value: 'user does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    // check if password matched
    let matched = await bcrypt.compare(password, customer.password);
    console.log('compare result:', matched);
    if (!matched) {
        throw {name : 'passwordUnmatched', value: 'password unmatched'};
    }

    return customer;
}

const getCustomerById = async (id) => {
    // TODO: get customer by id
    console.log('searching customer with id:', id);
    let customer = await Customers.findOne({_id: id});
    if (customer == null) {
        throw {name : 'UserNotExist', value: 'user does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    return customer;
}


module.exports = {
    getCustomerData: async (req, res) => {
        // TODO: Get customer by username
        console.log('> get customer data');
        console.log('req.body:', req.body); // username, array of request keys (eg 'email phoneNum')
        try {
            // fetch user by username
            let data = await Customers.findOne({username: req.body.username}, req.body.reqKeys);

            res.status(200).send(data);
        }
        catch (err) {
            res.status(404).send(err);
        }
    },

    // middleware for new user login
    addCustomer: async (req, res, next) => {
        // TODO : Add Customer to database (Register) by credentials
        console.log('> register new accout');
        console.log('req.body:', req.body); // username, pw.. etc
        try {
            // create customer account
            let customer = await Customers.create(req.body);
            console.log(customer)

            req.customer = customer

            // continue to login
            next()
        } 
        catch (err) {
            res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
        }
    },

    updateCustomer: async(req, res) => {
        // TODO: edit and update customer info
        try {
            res.status(200).send({});
        }
        catch (err) {
            res.send(err);
        }
    },

    uploadProfilePic: async (req, res, next) => {
        // TODO: upload profile image with key = 'profile' to server
        console.log('> upload profile');
        try {
            return upload.single('profile')(req, res, () => {
                if (!req.file) {
                    return res.send({name: "FileExtensionError", value: "image should be jpg or png"});
                }

                // continue to set store profile pic
                next();
            })
        }
        catch (err) {
            res.send(err);
        }
    },

    setProfilePic: async(req, res) => {
        // TODO: add profile pic to db
        console.log('> add profile');
        try {
            req.customer.profilePic = req.file.buffer;
            await req.customer.save();

            res.send(req.file);
        }
        catch (err) {
            res.send(err);
        }
    },

    getProfilePic: async(req, res) => {
        // TODO: view profile image
        try {
            res.set('Content-Type', 'image/png');  // or jpg
            res.send(req.customer.profilePic);
        }
        catch (err) {
            res.send(err);
        }
    },

    activateAccount: async (req, res) => {
        // TODO: activate account by clicking the link in email
        console.log(`> user with id${req.params.id} activate account`);

        try {
            let customer = await getCustomerById(req.params.id);
            console.log('customer doc:', customer);

            console.log('activated account, now generate token for login')

            // activated with first login
            // generate token for enter home page
            let token = await customer.genAuthToken();

            // update last login
            customer.lastLogin = new Date();
            customer.activated = true;
            customer.online = true;
            customer.save();

            console.log("you get token:", token)

            res.status(200).send({token}); // 200: OK
        }
        catch(err) {
            console.log(err);
            res.status(403).send(err);
        }
    },

    // middleware for token verification
    verifyToken: async (req, res, next) => {
        // TODO: verify token by matching docs in db
        console.log('> verify token');
        // console.log(req.header('Authorization'));
        try {
            // extract token
            let token = req.header('Authorization').replace('Bearer ', '');
            console.log('token:', token);

            // decode playload
            console.log('ready to decode');
            let data = jwt.verify(token, SECRET);
            console.log('decoded with data:', data);

            // check with db and pull out customer doc
            let customer = await Customers.findOne({_id : data._id})
            if (customer == null) {
                console.log('verify error');
                throw {name: 'VerifyError', value: 'unable to find user'};
            }
            console.log('customer doc', customer.username);

            // check customer currently logging in
            if (!customer.online) {
                console.log('customer request token verification but his is not logging in');
                throw {name: 'InactiveUserRequestError', value: 'customer request token verification but his is not logging in'};
            }

            // pass to next middleware/function
            req.token = token;
            req.customer = customer;
        
            next();
        }
        catch (err) {
            console.log(err);
            res.status(401).send(err); // 401: unauthorized
        }
    }, 

    login: async (req, res) => {
        // TODO: login user by username, password
        console.log('> login to server');
        console.log('req.body:', req.body); // username, pw
        try {
            console.log('now authenticate customer');

            // authenticate customer
            let customer = await authCustomer(req.body.username, req.body.password);
            // console.log('authenticate successful, with user=', customer);

            if (customer.activated == false) { // user created account but not activated
                console.log('user not activate');
                res.status(401).send({name: 'AccountNotActivated', value: 'account not activated'});
            }

            // generate token for enter home page
            let token = await customer.genAuthToken();

            // update last login
            customer.lastLogin = new Date();
            customer.online = true;
            customer.save();

            console.log("you get token:", token)

            res.status(200).send({token}); // 200: OK
        }
        catch (err) {
            res.status(401).send(err) // 401: Unauthorized
        }
    },

    logout: async (req, res) => {
        // TODO: logout customer after token verification
        console.log('> logout');

        // update active status
        req.customer.online = false;
        req.customer.save();

        res.status(200).send({name: 'SuccessfullyLogout', value: 'Successfully logout'});
    }
}