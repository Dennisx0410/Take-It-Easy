/* 
PROGRAM email - Controller of email functionality

PROGRAMMER: Ip Tsz Ho, Yeung Long Sang

VERSION 1: written 1/3/2022

CHANGE HISTORY: refer to github push history

PURPOSE: Providing functions for the server to send email to user

MODULES:
otp-generator: generator One-time-password
nodemailer: enable mailing functionality

USAGE: 
Exporting email function to other module, mainly for sending customer otp code and notify restaurant approval status.
*/

// model
const Otp = require("../models/otp").Otp;
const Customers = require("../models/customer");

// package
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const { MAX_TRIAL } = require("../models/otp");

// const
const EXPIRE = 2 * 60; // 2 min

//Function to generate One-time-password
const generateOTP = () => {
  //Generate a 6 digits otp as string, only using character of digits of 0-9
  return otpGenerator
    .generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
    .toString();
};

//Function for sending email
const sendEmail = async (receiver, template) => {
  // create email transporter
  const transporter = nodemailer.createTransport({
    //Define service as gmail
    service: "gmail",
    //Email sender login credential
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PW,
    },
    //Bypass certificate requirement for current stage of development to prevent error, (Need to review this part during offical deployment) 
    tls: {
      rejectUnauthorized: false,
    },
  });

  // email template
  let email = await transporter.sendMail({
    from: `'Take it easy' <${process.env.GMAIL_USER}>`,
    to: receiver.email,
    subject: template.subject,
    html: template.html,
  });
};

//Export functions for other module to use
module.exports = {
  //Create and send verification email containing the OTP to customer 
  verifyEmail: async (req, res) => {
    try {
      // generate OTP
      let username;
      let otpContainer;
      let customer;

      let OTP = generateOTP();
      let currentTime = new Date();
      let expireTime = new Date(currentTime.getTime() + EXPIRE * 1000);

      if (req.customer) {
        // 1st time verify
        customer = req.customer;
        username = customer.username;

        // create new OTP to db
        otpContainer = await Otp.create({
          username: username,
          otp: OTP,
          wrongTrial: 0,
          expiresAt: expireTime,
        });
      } else {
        // reverify
        username = req.body.username;

        // already activated
        customer = await Customers.findOne({ username });
        if (customer.activated) {
          throw {
            name: "AlreadyActivated",
            message: "account already activated",
          };
        }

        // check whether there are OTP in db
        otpContainer = await Otp.findOne({ username });
        if (otpContainer == null) {
          // someone pretend to gain access via reverify but didn't signed up
          throw {
            name: "OtpNotFound",
            message:
              "User try to reverify without signing up/account already activated",
          };
        }

        // check OTP state
        let isExpired = otpContainer.expiresAt < new Date();
        let isTooMuchWrongTrial = otpContainer.wrongTrial >= MAX_TRIAL;

        if (isExpired || isTooMuchWrongTrial) {
          // expired OTP or too much wrong trial
          otpContainer.state = "Pending";
          otpContainer.otp = OTP;
          otpContainer.expiresAt = expireTime;
          otpContainer.wrongTrial = 0;

          await otpContainer.save();
        } else {
          if (req.accStatus) {
            // only login and signup would have extra status
            throw {
              name: `${req.accStatus}AndPendingOtp`,
              message: "There is a pending otp, no need to reverify",
            };
          } else {
            throw {
              name: "PendingOtp",
              message: "There is a pending otp, no need to reverify",
            };
          }
        }
      }

      // receiver info
      let receiver = {
        username: customer.username,
        email: customer.email,
      };

      // email template
      let template = {
        subject: "Welcome to Take It Easy",
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
                `,
      };

      sendEmail(receiver, template);

      if (req.accStatus) {
        // only login and signup would have extra status
        res.send({
          name: `${req.accStatus}AndVerificationEmailSent`,
          message: "Verification email sent",
        });
      } else {
        res.send({
          name: "VerificationEmailSent",
          message: "Verification email sent",
        });
      }
    } catch (err) {
      res.send(err);
    }
  },

  //Function for sending notification of approval of a restaurant.
  approvalEmail: async (req, res) => {
    try {

      // receiver info
      let receiver = {
        username: req.restaurant.username,
        email: req.restaurant.email,
      };

      let template = {
        subject: "[Approved] Signup to Take It Easy",
        html: `
                    Hi ${receiver.username}, this is Take It Easy. <br>
                    We are happy to inform your restaurant that the signup request has been approved by our admin! <br>
                    You may now signin to our platform to received orders! <br>
                    <br>
                    Take It Easy <br>
                    CSCI3100 Group F4
                `,
      };

      // email template
      sendEmail(receiver, template);

      res.send({
        name: `${req.accStatus}AndApprovalEmailSent`,
        message: "Approval email sent",
      });
    } catch (err) {
      res.send(err);
    }
  },

  //Function for sending notification of rejection of a restaurant.
  rejectEmail: async (req, res) => {
    try {

      // receiver info
      let receiver = {
        username: req.restaurant.username,
        email: req.restaurant.email,
      };

      let template = {
        subject: "[Rejected] Signup to Take It Easy",
        html: `
                    Hi ${receiver.username}, this is Take It Easy. <br>
                    We are sorry to inform your restaurant that the signup request has been rejected by our admin. <br>
                    Please do the signup again. <br>
                    <br>
                    Reason: <br>
                    <i>${req.body.reason}</i> <br>
                    <br>
                    Take It Easy <br>
                    CSCI3100 Group F4
                `,
      };

      // email template
      sendEmail(receiver, template);

      res.send({
        name: `${req.accStatus}AndRejectEmailSent`,
        message: "Reject email sent",
      });
    } catch (err) {
      res.send(err);
    }
  },
};
