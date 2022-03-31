// model
const Restaurant = require("../models/restaurant.js")

// package
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const sharp = require('sharp');

// const
const { MAX_TRIAL } = require('../models/otp');

// handle for image upload
const upload = multer({
    limits: {fileSize: 3 * 1024 * 1024}, // 3MB
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

const authRestaurant = async (username, password) => {
    // TODO: authenticate restaurant by username, password and return the restaurant doc if matched

    // fetch restaurant by username
    let restaurant = await Restaurant.findOne({username});
    if (restaurant == null) {
        throw {name: 'UserNotFound', message: 'User does not exist'};
    }
    console.log('restaurant doc:', restaurant.username);

    // check if password matched
    let matched = await bcrypt.compare(password, restaurant.password);
    console.log('compare result:', matched);
    if (!matched) {
        throw {name: 'InvalidPassword', message: 'Invalid password'};
    }

    return restaurant;
}

const getRestaurantByUsername = async (username) => {
    // TODO: get restaurant by username
    console.log('searching restaurant with username:', username);
    let restaurant = await Restaurant.findOne({username});
    if (restaurant == null) {
        throw {name : 'UserNotExist', message: 'User does not exist'};
    }
    console.log('restaurant doc:', restaurant.username);

    return restaurant;
}

const getRestaurantById = async (id) => {
    // TODO: get restaurant by id
    console.log('searching restaurant with id:', id);
    let restaurant = await Restaurant.findOne({_id: id});
    if (restaurant == null) {
        throw {name : 'UserNotExist', message: 'User does not exist'};
    }
    console.log('restaurant doc:', restaurant.username);

    return restaurant;
}


module.exports = {

    getRestaurantById: getRestaurantById,

    getRestaurantData: async (req, res) => {
        // TODO: Get restaurant by username
        console.log('> get restaurant data');
        console.log(req.restaurant)
        try {
            // fetch restaurant by username
            let data = await Restaurant.findOne({_id:req.restaurant._id});

            res.status(200).send(data);
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err);
        }
    },

    getNotActivatedRestaurant: async (req, res) =>{
        console.log('Fetching Not Activated Restaurant')
        try{
            let list = await Restaurant.find({activated:false})

            res.status(200).send(list)
        }
        catch (err){
            console.log(err)
            res.status(404).send(err)
        }
    },

    getAllRestaurantData: async (req, res)=>{
        //Function only fetch all activated restaurant
        console.log('Fetching All Activated Restaurant')
        try{
            let list = await Restaurant.find()

            res.status(200).send(list)
        }
        catch (err){
            console.log(err)
            res.status(404).send(err)
        }
    },

    // middleware for new user login
    addRestaurant: async (req, res, next) => {
        // TODO : Add restaurant to database (Register) by credentials
        console.log('> register new accout');
        console.log('req.body:', req.body); // username, pw.. etc
        try {
            // check user with same username already exists
            let restaurant = await Restaurant.findOne({username: req.body.username});

            if (restaurant) { // already exists
                throw {name: 'restaurant Already Existed', message: 'User with same username already registed'};
            }

            // create restaurant account
            restaurant = await Restaurant.create(req.body);
            // console.log(restaurant)

            req.restaurant = restaurant

            res.status(201).send("Done creating new restaurant")
            console.log(`New Restaurant Register with username ${req.body.username}`)
        } 
        catch (err) {
            res.status(400).send(err); // 400: Bad request // code 11000 would be sent if username duplicated
        }
    },

    updateRestaurant: async(req, res) => {
        // TODO: edit and update restaurant info
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

    setProfilePic: async(req, res) => {
        // TODO: add profile pic to db
        console.log('> add profile');
        try {
            // resize profile pic to 100x100px before storing to db
            let resizedBuf = await sharp(req.file.buffer).resize({
                width: 100, 
                height: 100
            }).toBuffer();
            req.restaurant.profilePic = resizedBuf;
            await req.restaurant.save();

            res.send({name: 'uploadSuccess', message: 'successfully uploaded/changed profile pic'});
        }
        catch (err) {
            console.log(err)
            res.send(err);
        }
    },

    getProfilePic: async(req, res) => {
        // TODO: view profile image
        try {
            // res.set('Content-Type', 'image/png');  // disable for testing in postman
            // res.set('Content-Type', 'image/jpeg');  // disable for testing in postman
            console.log('> sent profile');
            res.send(req.restaurant.profilePic);
        }
        catch (err) {
            res.send(err);
        }
    },

    login: async (req, res) => {
        // TODO: login user by username, password
        console.log('> login to server');
        console.log('req.body:', req.body); // username, pw
        try {
            console.log('now authenticate restaurant');

            // authenticate restaurant
            let restaurant = await authRestaurant(req.body.username, req.body.password);
            // console.log('authenticate successful, with user=', restaurant);

            // check account if activated
            if (restaurant.activated == false) { // user created account but not activated
                console.log('user not activate');
                throw {name: 'AccountNotActivated', message: 'account not activated'};
            }

            // generate token for enter home page
            let token = await restaurant.genAuthToken();

            restaurant.online = true
            restaurant.save()

            console.log("you get token:", token)

            res.status(200).send({token}); // 200: OK
        }
        catch (err) {
            console.log(err)
            res.status(401).send(err) // 401: Unauthorized
        }
    },

    logout: async (req, res) => {
        // TODO: logout restaurant after token verification
        console.log('> logout');
        try {
            req.restaurant.online = false
            req.restaurant.save()
            res.status(200).send({name: 'SuccessfullyLogout', message: 'Successfully logout'});
        }
        catch (err) {
            res.send(err);
        }
    },

    activeAccount: async (req, res) => {
        // TODO: activate account by clicking the link in email
        console.log(`> Restaurant ${req.body.username} activate account`);

        try {
            let restaurant = await getRestaurantByUsername(req.body.username);
            console.log('restaurant doc:', restaurant);

            // update last login
            if (restaurant.activated){
                throw {msg:"Account Already Activated"}
            }
            restaurant.activated = true;
            await restaurant.save();

            res.status(200).send({msg:"Account Activated"}); // 200: OK
        }
        catch(err) {
            console.log(err);
            res.status(403).send(err);
        }
    },
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

            // check with db and pull out restaurant doc
            let restaurant = await Restaurant.findOne({_id : data._id})
            if (restaurant == null) {
                console.log('verify error');
                throw {name: 'VerifyError', message: 'unable to find user'};
            }
            console.log('restaurant doc', restaurant.username);

            // check restaurant currently logging in
            // if (!restaurant.online) {
            //     console.log('restaurant request token verification but his is not logging in');
            //     throw {name: 'InactiveUserRequest', message: 'restaurant request token verification but his is not logging in'};
            // }

            // pass to next middleware/function
            req.token = token;
            req.restaurant = restaurant;
        
            console.log('> verify success')
            next();
        }
        catch (err) {
            console.log(err)
            res.status(401).send(err); // 401: unauthorized
        }
    }
}