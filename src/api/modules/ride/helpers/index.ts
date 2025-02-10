//Isolated update and fetch drivers
import redisService from "../../../../utils/redis";
import { IDriver } from "utils/types";

const storeDriverOrRiderSocketId = async (
  socketId: string,
  userId: string,
  role: string
) => {
  if (role === "driver") {
    await redisService.client.set(`driver:${userId}`, socketId);
  } else {
    await redisService.client.set(`rider:${userId}`, socketId);
  }
  console.log(`Mapped ${role} ${userId} to socket ${socketId}`);
};

const removeDriverOrRiderSocketId = async (
  userId: string,
  role: string
) => {
  if (role === "driver") {
    await redisService.client.del(`driver:${userId}`);
  } else {
    await redisService.client.del(`rider:${userId}`);
  }
  console.log(`Deleted ${role} ${userId}`);
};

const getSocketId = async (role: string, id: string) => {
  console.log(`Fetching socket ID for ${role}:${id}`);
  return await redisService.client.get(`${role}:${id}`);
};

const addDriverToRedis = async (driver: IDriver) => {
  try {
    const driverData = {
      id: driver.driverId,
      driverName: driver.driverName,
      driverPhone: driver.driverPhone,
      carType: driver.carType,
      latitude: driver.coOrdinates.lat,
      longitude: driver.coOrdinates.lon,
      onlineStatus: "online",
      timestamp: Date.now(),
    };

    const addedDriver = await redisService.client.hSet(
      `drivers:info:${driver.driverId}`,
      driverData
    );

    console.log(`Driver ${driver.driverId} added successfully`);
    return addedDriver;
  } catch (error) {
    console.error("Error adding driver to Redis:", error);
    throw new Error(error.message);
  }
};

const takeDriverOffline = async (driverId: string) => {
  try {
    const result = await redisService.client.del(`drivers:info:${driverId}`);
    console.log(`Driver ${driverId} taken offline successfully`);
    return result;
  } catch (error) {
    console.error("Error taking driver offline:", error);
  }
};

const fetchAllDriverKeys = async () => {
  let cursor = 0;
  const keys = [];
  do {
    const scanResult = await redisService.client.scan(cursor, {
      MATCH: "drivers:info:*",
    });
    cursor = scanResult.cursor;
    keys.push(...scanResult.keys);
  } while (cursor !== 0);
  return keys;
};

const fetchAllOnlineDrivers = async () => {
  try {
    const driverKeys = await fetchAllDriverKeys();
    const drivers = await Promise.all(
      driverKeys.map(async (key) => {
        const driver = await redisService.client.hGetAll(key);
        return driver;
      })
    );

    return drivers;
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};

export {
  addDriverToRedis,
  fetchAllOnlineDrivers,
  takeDriverOffline,
  getSocketId,
  storeDriverOrRiderSocketId,
  removeDriverOrRiderSocketId
};
