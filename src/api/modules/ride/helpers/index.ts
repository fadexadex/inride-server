//Isolated update and fetch drivers
import redisService from "../../../../utils/redis";
import { GeoReplyWith } from "redis";
import { IDriver } from "utils/types";

//this implementation seems to wanna cause some bottlenecks let's just get all the online drivers and their locations
// const addDriverToRedis = async (driver: IDriver) => {
//   try {
//     await redisService.client.geoAdd("online:drivers", {
//       longitude: driver.coOrdinates.lon,
//       latitude: driver.coOrdinates.lat,
//       member: driver.driverId,
//     });

//     await redisService.client.hSet(`drivers:info:${driver.driverId}`, {
//       driverName: driver.driverName,
//       driverPhone: driver.driverPhone,
//       carType: driver.carType,
//     });

//     console.log(`Driver ${driver.driverId} added successfully`);
//   } catch (error) {
//     console.error("Error adding driver to Redis:", error);
//   }
// };

// const fetchOnlineDriversWithinRadius = async () => {
//   try {
//     const drivers = await redisService.client.geoSearchWith(
//       "online:drivers",
//       { longitude: -122.27652, latitude: 37.805186 },
//       { radius: 5, unit: "km" },
//       [GeoReplyWith.COORDINATES, GeoReplyWith.DISTANCE]
//     );
//     console.log(drivers);
//   } catch (error) {
//     console.error("Error fetching drivers with distance:", error);
//   }
// };

// const fetchAllOnlineDrivers = async () => {
//   try {
//     const drivers = await redisService.client.geoSearchWith(
//       "online:drivers",
//       { longitude: -122.27652, latitude: 37.805186 },
//       { radius: 5, unit: "km" },
//       [GeoReplyWith.COORDINATES, GeoReplyWith.DISTANCE]
//     );
//     console.log(drivers);
//   } catch (error) {
//     console.error("Error fetching drivers with distance:", error);
//   }
// };
// async function initRedis() {
//   await redisService.createConnection();
// }

// export {
//   addDriverToRedis,
//   fetchAllOnlineDrivers,
//   fetchOnlineDriversWithinRadius,
// };

const addDriverToRedis = async (driver: IDriver) => {
  try {
    const driverData = {
      driverName: driver.driverName,
      driverPhone: driver.driverPhone,
      carType: driver.carType,
      latitude: driver.coOrdinates.lat,
      longitude: driver.coOrdinates.lon,
      onlineStatus: "online",
      timestamp: Date.now(),
    };

    await redisService.client.hSet(
      `drivers:info:${driver.driverId}`,
      driverData
    );

    // we can't afford a driver online for too long, so we set an expiry time of 30 seconds since a driver is expected to have updated his location before the 30 seconds elapses
    await redisService.client.expire(`drivers:info:${driver.driverId}`, 30);

    console.log(`Driver ${driver.driverId} added successfully`);
  } catch (error) {
    console.error("Error adding driver to Redis:", error);
  }
};

const fetchAllOnlineDrivers = async () => {
  try {
    const drivers = await redisService.client.keys("drivers:info:*");

    console.log(drivers);
    return drivers;
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};

export { addDriverToRedis, fetchAllOnlineDrivers };
