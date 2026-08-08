import nodemailer from "nodemailer";

const sendEmail = async (email, code, type = "verification") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, title, message;

    if (type === "password-reset") {
      subject = "Reset your Smart Clinic password";
      title = "Password Reset Code";
      message = "Use the code below to reset your password. This code expires in 10 minutes.";
    } else {
      subject = "Verify your Smart Clinic account";
      title = "Email Verification Code";
      message = "Use the code below to verify your email address. This code expires in 10 minutes.";
    }

    const mailOptions = {
      from: `"Smart Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f766e; margin-bottom: 8px;">${title}</h2>
          <p style="color: #475569; margin-bottom: 20px;">${message}</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center;">
            <h1 style="letter-spacing: 10px; color: #0f172a; margin: 0; font-size: 32px;">${code}</h1>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("EMAIL SENT:", info.response);
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    throw error;
  }
};

export default sendEmail;