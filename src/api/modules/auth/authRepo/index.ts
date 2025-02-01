import { Prisma, PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares/errorHandler";

class AuthRepo {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async handleUserOrDriverCreation(
    registerBody: Prisma.UserCreateInput & {
      driverDetails?: Prisma.DriverCreateInput;
    }
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.user.create({
        data: {
          firstName: registerBody.firstName,
          lastName: registerBody.lastName,
          email: registerBody.email,
          password: registerBody.password,
          role: registerBody.role,
        },
      });

      if (createdUser.role === "DRIVER") {
        if (!registerBody.driverDetails) {
          throw new AppError(
            "Driver details are required for driver registration",
            StatusCodes.BAD_REQUEST
          );
        }
        await prisma.driver.create({
          data: {
            ...registerBody.driverDetails,
            carCapacity: Number(registerBody.driverDetails.carCapacity),
            user: {
              connect: {
                id: createdUser.id,
              },
            },
          },
        });
      }
      return createdUser;
    });
  }
}

export default AuthRepo;
