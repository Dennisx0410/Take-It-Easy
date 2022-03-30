// package
const jwt = require('jsonwebtoken');
const cust = require('./customer');
const rest = require('./restaurant');

module.exports = {
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
            let userType = data.userType;
            console.log('user identity:', userType);

            let user;
            try {
                if (userType == 'customer') { // customer
                    // check with db and pull out customer doc
                    user = await cust.getCustomerById(data._id);
                }
                else if (userType == 'restaurant') { // restaurant
                    // check with db and pull out customer doc
                    user = await rest.getRestaurantById(data._id);
                }
                else if (userType == 'admin') { // admin
                    req.token = token;
                    console.log('> verify success')
                    return next();
                }
                else { // other user type
                    throw {name: 'UserTypeError', value: 'wrong user type'};
                }
            }
            catch (err) {
                if (err.name == 'UserNotExist') {
                    throw {name: 'VerifyError', message: 'unable to find user'};
                }
            }
            
            console.log(`${userType} doc`, user.username);

            // check user currently logging in
            if (!user.online) {
                console.log(`${userType} request token verification but his is not logging in`);
                throw {name: 'InactiveUserRequest', message: `${userType} request token verification but his is not logging in`};
            }

            // pass to next middleware/function
            req.token = token;
            req[`${userType}`] = user;
        
            console.log('> verify success')
            next();
        }
        catch (err) {
            res.status(401).send(err); // 401: unauthorized
        }
    }, 
}