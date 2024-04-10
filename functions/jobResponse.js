const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const jobResponse = async (applicantEmail, subject, body, email ) => {
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
            copyright: 'Copyright © 2024 RecruitLink. All rights reserved.'
        }
    });

    let response = {
        body: {
            name: 'Recruiter',
            intro: [`Subject: ${subject}`,
                    `Body: ${body}`,
                `Sender Email : ${email}`],
            outro: `Thank You for your Trust Towards us`,
        }
    };

    let mail = mailGenerator.generate(response);

    let message = {
        from: process.env.EMAIL,
        to: applicantEmail,
        subject: 'Job Application Regards',
        html: mail
    };


    try {
        await transporter.sendMail(message);
        return 'Email sent successfully!';
    } catch (err) {
        console.error('Error sending email:', err);
        return 'Failed to send email.';
    }
};

module.exports = jobResponse;
