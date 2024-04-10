const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const sendOtp = async (email, otp)=>{

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    };

    const transporter = nodemailer.createTransport(config);

    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "RECRUITLINK",
            link: "https://mailgen.js/",
            copyright: 'Copyright © 2016 RecruitLink. All rights reserved.'
        }
    });

    let response = {
        body: {
            name: 'User',
            intro: ['ONE TIME PASSWORD FOR EMAIL VERIFICATION IN RECRUITLINK',
                `your otp is ${otp}`],
            outro: 'Thanky You for Your Interest..'
        }
    };

    let mail = mailGenerator.generate(response);

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'One Time Password for RECRUITLINK',
        html: mail
    };

    try {
        await transporter.sendMail(message);
        return 'email is sent!!!'
    } catch (err) {
        return 'Email is not sent!!'
    };


};

module.exports = sendOtp;