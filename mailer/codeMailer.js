const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

async function sendMail(client) {
  // First, define send settings by creating a new transporter:

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
      port: 587, // Port for SMTP 25/465/587
      secure: false, // Usually true if connecting to port 465
      auth: {
        user: process.env.BUSINESSMAIL, // Your email address
        pass: process.env.GMAILPASSWORD, // Password (for gmail, your app password)
      },
    });

    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
      from: process.env.BUSINESSMAIL,
      to: client,
      subject: "Testing, testing, 123",
      html: `
    <h1>Hello there</h1>
    <p>Isn't NodeMailer useful?</p>
    `,
    });
  } catch (e) {
    console.log(e, "Mail Fail");
  }

  console.log(info.messageId); // Random ID generated after successful send (optional)
}

module.exports = sendMail;
