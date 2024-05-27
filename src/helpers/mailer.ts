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
          verifyTokenExpiry: (Date.now() + 3600000).toString(),
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

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "3ac1112198e738",
        pass: "********1614",
      },
    });

    const mailOptions = {
      from: "nakulbhardwaj37@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType == "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${HashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyemail?token=${HashedToken}
            </p>`, // html body
    };

    const mailRes = await transport.sendMail(mailOptions);

    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
