import { error } from "console";
import prisma from "../../../../../dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { sendEmail } from "@/helpers/mailer";
import { registerSchema } from "../../../../../models/zodSchema/zodSchema";
import { RegisterData } from "../../../../../models/inferredType/user";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { username, email, password } = reqBody;
    //validation using zod
    const parsedResult = registerSchema.safeParse({
      username,
      email,
      password,
    });

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json(
        { error: "User already exits" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    // console.log(newUser);

    //send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: newUser.id });

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
