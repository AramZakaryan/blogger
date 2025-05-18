import nodemailer, { Transporter } from 'nodemailer'
import { config } from 'dotenv'

config()

const email = process.env.EMAIL_FOR_NODEMAILER || ''
const appPassword = process.env.APP_PASSWORD_FOR_NODEMAILER || ''

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: appPassword,
  },
})

export const nodemailerService = {
  sendEmail: async ()=> {
    const info = await transporter.sendMail({
      from: `"Blogger App Notifications" <${email}>`,
      to: 'aram.h.zakaryan@gmail.com',
      subject: 'Welcome to Blogger App!',
      text: 'Hi Aram,\n\nThanks for signing up! We’re glad to have you with us.\n\nBest,\nThe Blogger App Team',
      html: `
    <p>Hi Aram,</p>
    <p>Thanks for signing up! We’re excited to have you on board.</p>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>– The Blogger App Team</p>
  `,
    });

    console.log('Email sent:', info.messageId);
  }
}

