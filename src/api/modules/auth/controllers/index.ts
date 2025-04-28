import { registerUser, loginUser } from "../services";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloud";
import { AppError } from "../../../middlewares/errorHandler";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files && Object.keys(files).length === 2) {
      const licensePath = files?.["license"]?.[0]?.path;
      const facePath = files?.["face"]?.[0]?.path;
      if (licensePath && facePath) {
        const licenseUrl = await uploadImageToCloudinary(licensePath);
        const faceUrl = await uploadImageToCloudinary(facePath);
        req.body.driverDetails.licenseUrl = licenseUrl;
        req.body.driverDetails.faceUrl = faceUrl;
      } else {
        throw new AppError("License and Face path absent", 400);
      }
    }

    const { userData, token } = await registerUser(req.body);
    res.header("Authorization", `Bearer ${token}`);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: userData,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userData, token } = await loginUser(req.body);
    res.header("Authorization", `Bearer ${token}`);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: userData,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { register, login };
