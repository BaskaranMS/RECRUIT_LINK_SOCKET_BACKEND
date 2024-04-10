const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

const jobApplication = async (recruiterEmail, subject, body, resume, portfolio, applicantEmail) => {
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
                    `Portfolio Link: ${portfolio}`,
                `Applicant Email : ${applicantEmail}`],
            outro: `Thank You for your Trust Towards RecruitLink`,
        }
    };

    let mail = mailGenerator.generate(response);

    let message = {
        from: process.env.EMAIL,
        to: recruiterEmail,
        subject: 'Job Application Details',
        html: mail
    };

    if (resume) {
        message.attachments = [{
            filename: 'resume.pdf',
            content: resume, // Assuming resume is a Buffer containing the resume data
            contentType: 'application/pdf'
        }];
    }

    try {
        await transporter.sendMail(message);
        return 'Email sent successfully!';
    } catch (err) {
        console.error('Error sending email:', err);
        return 'Failed to send email.';
    }
};

module.exports = jobApplication;
