import { Request, Response, NextFunction } from "express";
import { registerUserSchema } from "./schemas";
import { AppError } from "../../../middlewares/errorHandler";

const validateRegisterBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    next(new AppError(error.details.map((err) => err.message).join(", "), 400));
  }
  next();
};

export { validateRegisterBody };
