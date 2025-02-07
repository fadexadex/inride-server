import { Prisma } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface ICoOrdinates {
  lon: number;
  lat: number;
}

export interface IDriver {
  driverId: string;
  driverName: string;
  driverPhone: string;
  carType: string;
  coOrdinates?: ICoOrdinates;
}

export interface IRideResponseData {
  accepted: boolean;
  driverId: string;
  riderId: string;
  requestDetails: IRequestDetails;
}

export interface IRequestDetails {
  rideId?: string;
  location: ICoOrdinates;
  locationTitle: string;
  destination: ICoOrdinates;
  destinationTitle: string;
}
