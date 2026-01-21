const nodemailer = require('nodemailer');
import { Resend } from 'resend';
// Create reusable transporter object using Gmail SMTP
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "sakalaeric87@gmail.com",
//         pass: "clndyzhspidufyfs",
//     },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GOOGLE_APP_NAME,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Transporter verification failed:', error.message);
    } else {
        console.log('Transporter is ready to send emails');
    }
});

// Function to send approval email
exports.sendApprovalEmail = async (fr, subject, text, phone) => {
    const phoneText = phone ? `\n\nPhone: ${phone}` : '';
    await transporter.sendMail({
        from: fr,
        to: transporter.options.auth.user, // Send to admin
        subject,
        text: `${text}${phoneText}`,
    })
}

exports.sendVerificationEmail = async (userEmail, subject, text) => {
await transporter.sendMail({
    from: transporter.options.auth.user,
    to:userEmail,
    subject,
    text,
})

}
//create a resend client
const resend = new Resend(process.env.RESEND_API_KEY);
//function to send email using resend
exports.sendEmailUsingResend = async (userEmail, userhtml) => {

    try {
        await resend.emails.send({
            from: `${userEmail}`,
            to: ["sakalaeric87@gmail.com"],
            subject:"Requesting for approval",
            html: `<strong>${userhtml}</strong>`,
        });
    } catch (error) {
        console.log("error from sending an email");
        
    }
};

exports.sendUserEmail = async (userEmail) => {

    try {
        await resend.emails.send({
            from: `sakalaeric@gmail.com`,
            to: [`${userEmail}`],
            subject:"Account Approved ✅",
            html: `<strong>Your account have been approved login and enjoy our services</strong>`,
        });
    } catch (error) {
        console.log("error from sending an email");
        
    }
};