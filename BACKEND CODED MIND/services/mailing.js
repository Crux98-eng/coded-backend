const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sakalaeric87@gmail.com",
        pass: "clndyzhspidufyfs",
    },
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



