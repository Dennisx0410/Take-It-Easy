// model 
const Otp = require('../models/otp').Otp;
const Customers = require('../models/customer');

// package
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const { MAX_TRIAL } = require('../models/otp');

// const 
const EXPIRE = 2 * 60; // 2 min

const generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false, 
        upperCaseAlphabets: false, 
        specialChars: false
    }).toString();
    
}

const sendEmail = async (receiver, OTP) => {
    // create email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.email',
        //port: 587,
        //secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PW
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // email template
    let template = await transporter.sendMail({
        from: `'Take it easy' <${process.env.GMAIL_USER}>`, 
        to: receiver.email, 
        subject: 'Welcome to Take It Easy', 
        html: `
            <h1>Welcome to Take It Easy!</h1> <br>
            Hi ${receiver.username}, welcome to Take It Easy. <br>
            To activate your account, please enter the following verification code to the take it easy website: <br>
            <h2><b>${OTP}</b></h2> <br>
            This code will be expired in 2 minutes!
            Enjoy placing order! <br>
            <br>
            Take It Easy <br>
            CSCI3100 Group F4
        `
    });

    console.log("Message sent: %s", template.messageId);
}

module.exports = {
    verifyEmail: async (req, res) => { 
        try {
            // generate OTP
            console.log('> generating OTP');

            let username;
            let otpContainer;
            let customer;

            let OTP = generateOTP();
            let currentTime = new Date();
            let expireTime = new Date(currentTime.getTime() + EXPIRE * 1000);
            
            if (req.customer) { // 1st time verify
                console.log('> 1st verify');
                customer = req.customer;
                username = customer.username

                console.log('OTP:', OTP);

                // create new OTP to db
                otpContainer = await Otp.create({
                    username: username,
                    otp: OTP, 
                    wrongTrial: 0,
                    expiresAt: expireTime
                })
                console.log('> created new otp to db');
            }
            else { // reverify
                console.log('reverify');
                username = req.body.username

                // already activated
                customer = await Customers.findOne({username});
                if (customer.activated) {
                    throw {name: 'AlreadyActivated', message: 'account already activated'}
                }

                // check whether there are OTP in db
                otpContainer = await Otp.findOne({username});
                if (otpContainer == null) { // someone pretend to gain access via reverify but didn't signed up
                    throw {name: 'OtpNotFound', message: 'User try to reverify without signing up/account already activated'}
                }

                // check OTP state
                let isExpired = (otpContainer.expiresAt < new Date());
                let isTooMuchWrongTrial = (otpContainer.wrongTrial >= MAX_TRIAL);

                if (isExpired || isTooMuchWrongTrial) { // expired OTP or too much wrong trial
                    console.log('> reverify')
                    
                    console.log('OTP:', OTP);

                    otpContainer.state = 'Pending';
                    otpContainer.otp = OTP;
                    otpContainer.expiresAt = expireTime;
                    otpContainer.wrongTrial = 0; 

                    await otpContainer.save();
                    console.log('> regenerated new otp to db');
                }
                else {
                    console.log('> pending OTP');
                    if (req.accStatus) { // only login and signup would have extra status
                        throw {name: `${req.accStatus}AndPendingOtp`, message: 'There is a pending otp, no need to reverify'};
                    }
                    else {
                        throw {name: 'PendingOtp', message: 'There is a pending otp, no need to reverify'};
                    }
                    
                } 
            }

            let receiver = {
                username: customer.username,
                email: customer.email
            }
            console.log(receiver);
            sendEmail(receiver, OTP);

            if (req.accStatus) { // only login and signup would have extra status
                res.send({name: `${req.accStatus}AndVerificationEmailSent`, message: "Verification email sent"});
            }
            else {
                res.send({name: 'VerificationEmailSent', message: 'Verification email sent'});
            }
        }
        catch (err) {
            res.send(err);
        }
    }
}
