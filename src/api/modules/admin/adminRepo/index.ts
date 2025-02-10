import { Prisma, PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../middlewares/errorHandler";

class AuthRepo {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }}