import { StatusCodes } from "http-status-codes";
import AuthRepo from "../authRepo";
import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../../middlewares/errorHandler";
import { hashPassword } from "../../../../utils/bcrypt";
import sanitizeUserAndGrantToken from "../../../../utils/sanitize";

const authRepo = new AuthRepo();

const registerUser = async (
  registerBody: Prisma.UserCreateInput & {
    driverDetails?: Prisma.DriverCreateInput;
  }
) => {
  const isRegistered = await authRepo.getUserByEmail(registerBody.email);
  if (isRegistered) {
    throw new AppError(
      "An account with the provided email already exists",
      StatusCodes.CONFLICT
    );
  }
  const { password } = registerBody;

  registerBody.password = await hashPassword(password);

  const createdUser = await authRepo.handleUserOrDriverCreation(registerBody);
  return sanitizeUserAndGrantToken(createdUser);
};

export { registerUser };
