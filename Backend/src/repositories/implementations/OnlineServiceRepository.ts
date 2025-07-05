// import { injectable } from "inversify";
// import { IOnlineServiceRepository } from "../interface/IOnlineServiceRepository";
// import BaseRepository from "./BaseRepository";
// import OnlineServiceModel from "../../models/onlineServiceModel";
// import { EOnlineService } from "../../entities/onlineServcieEntity";
// import redisClient from "../../config/redis";

// @injectable()
// export default class OnlineServiceRepository
//   extends BaseRepository<EOnlineService>
//   implements IOnlineServiceRepository
// {
//   constructor() {
//     super(OnlineServiceModel);
//   }

//   async setOnline(userId: string): Promise<void> {
//     try {
//       await redisClient.set(`online:${userId}`, "1");
//     } catch (error: any) {
//       throw new Error(`Failed to set user online: ${error.message}`);
//     }
//   }

//   async isOnline(userId: string): Promise<boolean> {
//     try {
//       const status = await redisClient.get(`online:${userId}`);
//       return status === "1";
//     } catch (error: any) {
//       throw new Error(`Failed to check user online status: ${error.message}`);
//     }
//   }

//   async setOffline(userId: string): Promise<void> {
//     try {
//       await redisClient.del(`online:${userId}`);
//     } catch (error: any) {
//       throw new Error(`Failed to set user offline: ${error.message}`);
//     }
//   }
// }
