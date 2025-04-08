import { login, register } from "./controllers";
import { Router } from "express";
import upload from "../../../utils/multer";
import { validateRegisterBody } from "../../middlewares/validators";

const router = Router();


router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "face", maxCount: 1 },
  ]),
  validateRegisterBody,
  register
);

router.post("/login", login);

export default router;
