import nodemailer from "nodemailer";

const sendEmail = async (email, code) => {

  try {

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });

    const mailOptions = {

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Clinic System Verification Code",

      text: `Your verification code is: ${code}`,

    };

    const info = await transporter.sendMail(mailOptions);

    console.log("EMAIL SENT:", info.response);

  } catch (error) {

    console.log("EMAIL ERROR:", error.message);

  }
};

export default sendEmail;