import { Prisma } from "@prisma/client";
import { generateToken } from "./jwt";

const sanitizeUserAndGrantToken = (data: Prisma.UserCreateInput) => {
  const { password: _, ...userData } = data;
  return { userData, token: generateToken(userData) };
};

export default sanitizeUserAndGrantToken