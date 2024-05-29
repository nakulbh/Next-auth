import nodemailer from "nodemailer";
import prisma from "../dbConfig/dbConfig";
import bcrypt from "bcrypt";

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

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_HOST,
      auth: {
        user: process.env.MAILTRAP_AUTH_USER,
        pass: process.env.MAILTRAP_AUTH_PASS,
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

    const mailRes = await transport.sendMail(mailOptions);

    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
