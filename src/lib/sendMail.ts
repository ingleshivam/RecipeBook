"use server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import generateMailTemplate from "@/actions/generateMailTemplate";
const otp = crypto.randomInt(100000, 999999);
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  sendTo,
  name,
  usage,
}: {
  sendTo: string;
  name?: string;
  usage?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }

  let link;
  if (usage === "change_password") {
    console.log("In the change password section");
    const encdecResponse = await fetch(
      `${process.env.NEXTAUTH_URL}api/encdecData?encryptMessage=${otp}`
    );
    const encdecData = await encdecResponse.json();
    link = `${process.env.NEXTAUTH_URL}auth/change-password?token=${encdecData?.data?.encodedMessage}`;
  }

  try {
    const info = await transporter.sendMail({
      from: "shivam.personalprojects@gmail.com",
      to: sendTo || SITE_MAIL_RECIEVER,
      subject: "Login Verification",
      text: "Login Verification",
      html: generateMailTemplate(usage || "", otp, name, link),
    });
    console.log("Message Sent", info.messageId);
    console.log("Mail sent to", SITE_MAIL_RECIEVER);
    return { status: 200, otp: otp };
  } catch (error) {
    return { status: 400 };
  }
}
