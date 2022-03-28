// model 
const Otp = require('../models/otp').Otp;

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
        // port: 587,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PW
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

            let OTP = generateOTP();
            let currentTime = new Date();
            let expireTime = new Date(currentTime.getTime() + EXPIRE * 1000);
            
            if (req.customer) { // 1st time verify
                console.log('> 1st verify');
                username = req.customer.username

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
                username = req.body.username
                otpContainer = await Otp.findOne({username});
 
                // check whether there are OTP in db
                if (otpContainer == null) { // someone pretend to gain access via reverify but didn't signed up
                    throw {name: 'OtpNotFound', value: 'User try to reverify without signing up/account already activated'}
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
                    throw {name: 'PendingOtp', value: 'There is a pending otp, no need to reverify'};
                } 
            }

            let receiver = {
                username: req.body.username,
                email: req.body.email
            }
            sendEmail(receiver, OTP);

            res.send({name: "VerificationEmailSent", value: "Verification email sent"});
        }
        catch (err) {
            res.send(err);
        }
    }
}
