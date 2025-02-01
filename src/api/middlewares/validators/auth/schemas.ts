import Joi from "joi";

export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid("USER", "ADMIN", "DRIVER").required(),
  driverDetails: Joi.object({
    carType: Joi.string().required(),
    carCapacity: Joi.number().required(),
  }).when("role", {
    is: "DRIVER",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
