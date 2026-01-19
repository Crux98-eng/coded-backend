const nodemailer = require('nodemailer');

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