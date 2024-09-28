import nodemailer from 'nodemailer'

interface EmailOptions {
  email : string,
  subject : string,
  message : string
}

export default async (options : EmailOptions) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "45a5f4d41afff0",
      pass: "0acede37aa0000"
    }
  });

  const message = {
    from : `${process.env.SMTP_FROM_NAME} ${process.env.SMTP_FROM_EMAIL}`,
    to : options.email,
    subject : options.subject,
    html : options.message
  } 

  await transport.sendMail(message)
}