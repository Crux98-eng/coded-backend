import { Resend } from 'resend';

//create a resend client
const resend = new Resend('re_WX8AeyG4_2HbLFkEkriMecswZkFST4vPY');
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
        <p><strong>Subdcription:</strong> ${user.plan}</p>
        <p><strong>Course Name:</strong> ${user.course_name}</p>
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

export const sendUserInvoice = async (userEmail) => {
  try {
    await resend.emails.send({
      from: "HAUSHALT <onboarding@resend.dev>", // same sender
      to: [userEmail],
      subject: "Payment Invoice",
      html: `
        <h2>Please make payment to the following details and complete your registration:</h2>
        <p><strong>Amount:</strong> K150</p>
        <p><strong>Airtel Money:</strong> 0775793777</p>
        <p><strong>MTN Money:</strong> +260760067551</p>
        <p>Please send us proof of payment via email or WhatsApp.</p>
        <p>Thank you for your cooperation.</p>
      `,
    });
  } catch (error) {
    console.error("User email error:", error);
  }
};

export const sendUserEmailBlocking = async (userEmail) => {
  try {
    await resend.emails.send({
      from: "HAUSHALT <onboarding@resend.dev>", // same sender
      to: [userEmail],
      subject: "Your Account Is Blocked 🚫",
      html: `
        <h2>Account Blocked</h2>
        <p>Your account has  been blocked due to either subscription expirely or other issues.</p>
        <p>please contact the admin to resolve the issue or resubscribe through the platform.</p>
      `,
    });
  } catch (error) {
    console.error("User email error:", error);
  }
};
