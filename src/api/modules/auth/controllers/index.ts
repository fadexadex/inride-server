import { registerUser } from "../services";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import uploadImageToCloudinary from "../../../../utils/uploadImageToCloud";

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
      }
    }
    const user = await registerUser(req.body);
    res.header("Authorization", `Bearer ${user.token}`);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: user.userData,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { register };
