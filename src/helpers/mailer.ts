import nodemailer from "nodemailer";
import prisma from "../dbConfig/dbConfig";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    if (emailType == "VERIFY") {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: "",
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOptions = {
      from: "nakulbhardwaj37@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType == "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
      html: "<b>Hello world?</b>", // html body
    };

    const mailRes = await transporter.sendMail(mailOptions);

    return mailRes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
