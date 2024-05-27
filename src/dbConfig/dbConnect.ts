import prisma from "./dbConfig";

export async function connectToDatabase() {
  try {
    await prisma.$connect();
  } catch (error) {
    throw new Error("Unable to connect to database");
  }
}
