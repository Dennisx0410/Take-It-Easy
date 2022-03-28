// model
const Customers = require('../models/customer');
const Otp = require('../models/otp').Otp;

// package
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// const
const { MAX_TRIAL } = require('../models/otp');

// handle for image upload
const upload = multer({
    limits: {fileSize: 3 * 1024 * 1024}, // 3MB
    fileFilter(req, file, cb) {
        console.log('file info:', file)
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            console.log('cant upload!')
            cb(null, false);
        }
    }
});

const authCustomer = async (username, password) => {
    // TODO: authenticate customer by username, password and return the customer doc if matched

    // fetch user by username
    let customer = await Customers.findOne({username});
    if (customer == null) {
        throw {name: 'UserNotExist', value: 'User does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    // check if password matched
    let matched = await bcrypt.compare(password, customer.password);
    console.log('compare result:', matched);
    if (!matched) {
        throw {name: 'InvalidPassword', value: 'Invalid password'};
    }

    return customer;
}

const getCustomerByUsername = async (username) => {
    // TODO: get customer by username
    console.log('searching customer with username:', username);
    let customer = await Customers.findOne({username});
    if (customer == null) {
        throw {name : 'UserNotExist', value: 'User does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    return customer;
}

const getCustomerById = async (id) => {
    // TODO: get customer by id
    console.log('searching customer with id:', id);
    let customer = await Customers.findOne({_id: id});
    if (customer == null) {
        throw {name : 'UserNotExist', value: 'User does not exist'};
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
            // check user with same username already exists
            let customer = await Customers.findOne({username: req.body.username});

            if (customer) { // already exists
                throw {name: 'UserAlreadyExisted', value: 'User with same username already registed'};
            }

            // create customer account
            customer = await Customers.create(req.body);
            // console.log(customer)

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
                    console.log('> upload failed')
                    return res.status(400).send({name: "FileExtensionError", value: "image should be jpg or png"});
                }
                else {
                    console.log('> Upload Success')
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
            // res.set('Content-Type', 'image/png');  // or jpg
            // console.log(req.customer.profilePic);
            console.log('> sent profile');
            res.send(req.customer.profilePic);
        }
        catch (err) {
            res.send(err);
        }
    },

    verifyOTP: async (req, res, next) => {
        // TODO: verify the OTP with db before activating account
        try {
            let otpContainer = await Otp.findOne({username: req.body.username});
            if (otpContainer == null) {
                throw {name: 'OtpNotFound', value: 'User did not sent account verification request/account activated'};
            }

            // check otp expired
            if (otpContainer.expiresAt < new Date()) {
                console.log('> otp expired', otpContainer.expiresAt, new Date());
                throw {name: 'OtpExpired', value: 'OTP expired, please send request to generate OTP again'};
            }

            // check if the same user having too much wrong trials (3 times)
            if (otpContainer.wrongTrial >= MAX_TRIAL) {
                throw {name: 'TooMuchTrials', value: 'User entered too much wrong trials, please send request to generate OTP again'};
            }

            // check if otp match
            let matched = await bcrypt.compare(req.body.otp, otpContainer.otp);
            console.log('compare result:', matched);
            if (!matched) {
                // add one trial
                otpContainer.wrongTrial += 1;
                otpContainer.save();
                throw {name: 'InvalidOtp', value: 'Invalid OTP'};
            }
            
            // delete OTP when success
            await Otp.deleteOne({username: req.body.username});

            next()
        }
        catch (err) {
            res.status(400).send(err);
        }
    },

    activateAccount: async (req, res) => {
        // TODO: activate account by clicking the link in email
        console.log(`> user ${req.body.username} activate account`);

        try {
            let customer = await getCustomerByUsername(req.body.username);
            console.log('customer doc:', customer);

            console.log('activated account, now generate token for login')

            // activated with first login
            // generate token for enter home page
            let token = await customer.genAuthToken();

            // update last login
            customer.lastLogin = new Date();
            customer.activated = true;
            customer.online = true;
            await customer.save();

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
        try {
            // extract token
            let token = req.header('Authorization').replace('Bearer ', '');
            console.log('token:', token);

            // decode playload
            console.log('ready to decode');
            let data = jwt.verify(token, process.env.SECRET);
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
        
            console.log('> verify success')
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

            // check account if activated
            if (customer.activated == false) { // user created account but not activated
                console.log('user not activate');
                throw {name: 'AccountNotActivated', value: 'account not activated'};
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