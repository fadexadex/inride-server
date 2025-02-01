import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface IDriver{
  driverId: string;
  driverName: string;
  driverPhone: string;
  carType: string;
  coOrdinates?: {
    lon: number;
    lat: number;
  }

}
