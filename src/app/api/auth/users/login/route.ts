import prisma from "@/dbConfig/dbConfig";
import { connectToDatabase } from "@/dbConfig/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { error } from "console";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    console.log(user);

    // if (!user) {
    //   return NextResponse.json({ message: "user not found" }, { status: 400 });
    // } else {
    //   console.log("user found");
    // }

    // if (!user.isVerified == true) {
    //   console.log("user is not verified");
    // }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    //create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
