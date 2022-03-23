const nodemailer = require("nodemailer");
const sender = require('../cred.json').sender;

module.exports = {
    verifyEmail: async (req, res) => { 
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: sender.email, 
                    pass: sender.password
                }
            });

            let info = await transporter.sendMail({
                from: `'Take it easy' <${sender.email}>`, 
                to: req.body.email, 
                subject: 'Welcome to Take It Easy', 
                text: `Hi ${req.body.username}, welcome to Take It Easy, enjoy placing your order
                Please click the follow link to activate your account for the first time:
                http://localhost:5000/customer/activate/${req.customer._id}`, 
                // html: '<h1>Welcome To Take IT Easy</h1>', 
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.send({name: "VerificationEmailSent", value: "verification email sent"});
        }
        catch (err) {
            res.send(err)
        }
    }
}
