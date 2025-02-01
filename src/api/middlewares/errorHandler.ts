import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";


export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
