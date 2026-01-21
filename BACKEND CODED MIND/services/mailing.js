import { Resend } from 'resend';

//create a resend client
const resend = new Resend(process.env.RESEND_API_KEY);
//function to send email using resend
export const sendEmailUsingResend = async (userEmail, userhtml) => {

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

export const sendUserEmail = async (userEmail) => {

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