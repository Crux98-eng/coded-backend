import { Resend } from 'resend';

//create a resend client
const resend = new Resend(process.env.RESEND_API_KEY);
//function to send email using resend


export const sendAdminApprovalEmail = async (user) => {
  try {
    await resend.emails.send({
      from: "HAUSHALT <onboarding@resend.dev>", // or verified domain
      to: ["sakalaeric87@gmail.com"],
      subject: "New User Waiting Approval",
      html: `
        <h2>New Registration</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p>Status: <b>Waiting Approval</b></p>
      `,
    });
  } catch (error) {
    console.error("Admin email error:", error);
  }
};

export const sendUserApprovedEmail = async (userEmail) => {
  try {
    await resend.emails.send({
      from: "HAUSHALT <onboarding@resend.dev>", // same sender
      to: [userEmail],
      subject: "Your Account Is Approved 🎉",
      html: `
        <h2>Account Approved</h2>
        <p>Your account has been approved.</p>
        <p>You can now log in and start using the platform.</p>
      `,
    });
  } catch (error) {
    console.error("User email error:", error);
  }
};
