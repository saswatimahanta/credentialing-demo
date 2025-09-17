import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Configure your SMTP transport (use SendGrid, Gmail SMTP, Mailgun, etc.)
  // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: "06179ff0c161e0",
        pass: "bed8fa89ed09c3"
        }
    });

  try {
    await transport.sendMail({
      from:'FastCred <admin@fastcred.com>',
      to,
      subject,
      html: body.replace(/\n/g, "<br>"), // Convert newlines to <br> for HTML
    });

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
}
