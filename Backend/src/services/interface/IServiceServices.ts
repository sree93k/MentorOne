import { EService } from "../../entities/serviceEntity";

export interface IServiceServices {
  findAllServices(): Promise<EService[]>;
}
