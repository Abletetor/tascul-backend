import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: process.env.EMAIL_USER || 'abletetor@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'qlmb ifzm bvkj ltcw',
   },
});

export const sendVerificationEmail = async (intern, token) => {
   const url = `${process.env.CLIENT_URL}/email-verification?token=${token}`;
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: intern.email,
         subject: 'Verify Your Email Intern',
         html: `<p>Hello ${intern.name},</p>
               <p>Thank you for signing up for our internship program. Great to have you here! Please verify your email by clicking the link below:</p>
               <a href="${url}">Verify Email</a>`,
      });
      console.log('Verification email sent to:', intern.email);
   } catch (error) {
      console.error('Error sending verification email:', error);
   }
};
