import { EOnlineService } from "../../entities/onlineServcieEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IOnlineServiceRepository
  extends IBaseRepository<EOnlineService> {
  setOnline(userId: string): Promise<void>;
  isOnline(userId: string): Promise<boolean>;
  setOffline(userId: string): Promise<void>;
}
