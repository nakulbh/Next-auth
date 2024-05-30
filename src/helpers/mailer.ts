import nodemailer from "nodemailer";
import prisma from "../dbConfig/dbConfig";
import bcrypt from "bcrypt";
import { object } from "zod";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const HashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType == "VERIFY") {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: HashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType == "RESET") {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          forgotPasswordToken: HashedToken,
          forgotPasswordTokenExpiry: (Date.now() + 3600000).toString(),
        },
      });
    }

    if (
      !process.env.MAILTRAP_HOST ||
      !process.env.MAILTRAP_AUTH_USER ||
      !process.env.MAILTRAP_AUTH_PASS
    ) {
      throw new Error(
        "Missing required environment variables for email transport."
      );
    }

    const connection = {
      host: process.env.MAILTRAP_HOST,
    };

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: 2525,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.MAILTRAP_AUTH_USER,
        pass: process.env.MAILTRAP_AUTH_PAS,
      },
    });

    const mailOptions = {
      from: "nakulbhardwaj@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType == "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: `<p>Click <a href="${
        process.env.VERIFYMAUL_DOMAIN
      }/verifyemail?token=${HashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.VERIFYMAUL_DOMAIN
            }/verifyemail?token=${HashedToken}
            </p>`, // html body
    };

    const mailRes = await transporter.sendMail(mailOptions);

    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
