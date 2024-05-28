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

    await connectToDatabase();
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  } finally {
    prisma.$disconnect();
  }
}
