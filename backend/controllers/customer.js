// model
const Customers = require('../models/customer');
const Otp = require('../models/otp').Otp;

// package
const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');

// const
const { MAX_TRIAL } = require('../models/otp');
const res = require('express/lib/response');

// handle for image upload
const upload = multer({
    limits: {fileSize: 5 * 1024 * 1024}, // 5MB
    fileFilter(req, file, cb) {
        console.log('file info:', file)
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') { // jpg, jpeg, jfif are udner image/jpeg
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
    console.log('> auth customer');
    let customer = await Customers.findOne({username});
    if (customer == null) {
        throw {name: 'UserNotFound', message: 'User does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    // check if password matched
    let matched = await bcrypt.compare(password, customer.password);
    console.log('compare result:', matched);
    if (!matched) {
        throw {name: 'InvalidPassword', message: 'Invalid password'};
    }
    console.log('> auth done');

    return customer;
}

const getCustomerByUsername = async (username) => {
    // TODO: get customer by username
    console.log('> searching customer with username:', username);
    let customer = await Customers.findOne({username});
    if (customer == null) {
        throw {name : 'UserNotExist', message: 'User does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    return customer;
}

const getCustomerById = async (id) => {
    // TODO: get customer by id
    console.log('> searching customer with id:', id);
    let customer = await Customers.findOne({_id: id});
    if (customer == null) {
        throw {name : 'UserNotExist', message: 'User does not exist'};
    }
    console.log('customer doc:', customer.username, customer.lastLogin);

    return customer;
}

const getCustomers = async () => {
    // TODO: get all customers
    console.log('> get all customers');
    let customers = await Customers.find();
    console.log('number of customers:', customers.length)
    return customers;
}

module.exports = {
    getCustomerData: async (req, res) => {
        // TODO: return customer data
        res.send({
            userID: req.customer._id,
            username: req.customer.username, 
            phoneNum: req.customer.phoneNum, 
            email: req.customer.email,
            points: req.customer.points, 
            profilePic: req.customer.profilePic
        })
    },

    getCustomerById: getCustomerById,

    getCustomers: async (req, res) => {
        // TODO: get all customers
        try {
            let customers = await getCustomers();
            console.log('number of customers:', customers.length)
            res.send(customers);
        }
        catch (err) {
            res.send(err);
        }
    },

    // middleware for new user login
    addCustomer: async (req, res, next) => {
        // TODO : Add Customer to database (Register) by credentials
        console.log('> register new accout');
        // console.log('req.body:', req.body); // username, pw.. etc
        try {
            // check user with same username already exists
            let customer = await Customers.findOne({username: req.body.username});

            if (customer) { // already exists
                console.log('> user already existed');
                throw {name: 'UserAlreadyExisted', message: 'User with same username already registed'};
            }

            // create customer account
            customer = await Customers.create(req.body);
            // console.log(customer)

            req.customer = customer
            req.accStatus = 'SignupSuccess';

            // continue to set profile pic
            next()
        } 
        catch (err) {
            res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
        }
    },

    changePw: async (req, res) => {
        // TODO: change pw given old and new password pair
        console.log('> change pw')
        try {
            let passwordOld = req.body.passwordOld;
            let passwordNew = req.body.passwordNew;

            // check user with same username already exists
            let customer = await Customers.findOne({username: req.customer.username});

            // check if old pw matched
            let matched = await bcrypt.compare(passwordOld, customer.password); 
            console.log('compare result:', matched);
            if (!matched) {
                throw {name: 'InvalidPassword', message: 'Invalid password'};
            }

            // check if new pw same as old pw
            if (passwordOld === passwordNew) {
                throw {name: 'DuplicatedNewPassword', message: 'New password is same as the old password'};
            }

            console.log('password len:', passwordNew.length);
            // check if new pw is longer than 8 characters
            if (passwordNew.length < 8) {
                throw {name: 'LengthTooShort', message: 'Password length should be greater than 8'};
            }

            customer.password = passwordNew;
            await customer.save();

            // continue to set profile pic
            res.status(200).send({name: 'SuccessfullyChangedPassword', message: 'Successfully changed pw'});
        }
        catch (err) {
            res.send(err);
        }
    },

    // middleware
    uploadProfilePic: async (req, res, next) => {
        // TODO: upload profile image with key = 'profile' to server
        console.log('> upload profile');
        try {
            return upload.single('profile')(req, res, () => {
                // console.log('req.body:', req.body);
                // console.log('req.file:', req.file);
                if (!req.file) {
                    console.log('> upload failed')
                    return res.status(400).send({name: "FileExtensionError", message: "image should be jpg or png"});
                }
                else {
                    console.log('filesize:', req.file.size)
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

    // middleware
    setProfilePic: async (req, res, next) => {
        // TODO: add profile pic to db
        console.log('> add profile');
        try {
            // resize profile pic to 100x100px before storing to db
            let resizedBuf = await sharp(req.file.buffer).resize({
                width: 100, 
                height: 100
            }).toBuffer();
            req.customer.profilePic = resizedBuf;
            await req.customer.save();

            next();
        }
        catch (err) {
            console.log(err)
            res.send(err);
        }
    },

    getProfilePic: async (req, res) => {
        // TODO: view profile image
        try {
            // res.set('Content-Type', 'image/png');  // disable for testing in postman
            // res.set('Content-Type', 'image/jpeg');  // disable for testing in postman
            console.log('> sent profile');
            res.send(req.customer.profilePic);
        }
        catch (err) {
            res.send(err);
        }
    },

    // middleware
    verifyOTP: async (req, res, next) => {
        // TODO: verify the OTP with db before activating account
        try {
            console.log(req.body);

            // already activated
            let customer = await Customers.findOne({username: req.body.username});
            if (customer.activated) {
                throw {name: 'AlreadyActivated', message: 'account already activated'}
            }

            // OTP not exists in db
            let otpContainer = await Otp.findOne({username: req.body.username});
            if (otpContainer == null) {
                throw {name: 'OtpNotFound', message: 'User did not sent account verification request'};
            }

            // check otp expired
            if (otpContainer.expiresAt < new Date()) {
                console.log('> otp expired', otpContainer.expiresAt, new Date());
                throw {name: 'OtpExpired', message: 'OTP expired, please send request to generate OTP again'};
            }

            // check if the same user having too much wrong trials (3 times)
            if (otpContainer.wrongTrial >= MAX_TRIAL) {
                throw {name: 'TooMuchTrials', message: 'User entered too much wrong trials, please send request to generate OTP again'};
            }

            // check if otp match
            let matched = await bcrypt.compare(req.body.otp, otpContainer.otp);
            console.log('compare result:', matched);
            if (!matched) {
                // add one trial
                otpContainer.wrongTrial += 1;
                otpContainer.save();
                throw {name: 'InvalidOtp', message: 'Invalid OTP'};
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

    login: async (req, res, next) => {
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
                console.log('> user not activated');
                req.accStatus = 'AccountNotActivated';

                // go to send verify email
                return next();
                // throw {name: 'AccountNotActivated', message: 'account not activated'};
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
        try {
            // update active status
            req.customer.online = false;
            await req.customer.save();

            res.status(200).send({name: 'SuccessfullyLogout', message: 'Successfully logout'});
        }
        catch (err) {
            res.send(err);
        }
    }
}