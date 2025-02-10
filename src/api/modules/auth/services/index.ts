import { StatusCodes } from "http-status-codes";
import AuthRepo from "../authRepo";
import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../../../middlewares/errorHandler";
import { hashPassword, comparePassword } from "../../../../utils/bcrypt";
import sanitizeUserAndGrantToken from "../../../../utils/sanitize";
import { ILoginBody } from "../../../../utils/types";

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

const loginUser = async (loginBody: ILoginBody) => {
  const { email, password } = loginBody;
  const user = await authRepo.getUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }
  return sanitizeUserAndGrantToken(user);
};

export { registerUser, loginUser };
