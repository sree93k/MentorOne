// import { ESchedule } from "../../entities/scheduleEntity";
// import { EBlockedDate } from "../../entities/blockedEntity";
// import scheduleModel from "../../models/scheduleModel";
// import blockedModel from "../../models/blockedModel";
// import { ISlotRepository } from "../interface/ISlotRepository";

// export default class SlotRepository implements ISlotRepository {
//   async findAvailableSlots(serviceId: string): Promise<ESchedule[]> {
//     console.log("SlotRepository findAvailableSlots steo 1", serviceId);
//     const response = await scheduleModel.find({ _id: serviceId });
//     console.log("SlotRepository findAvailableSlots steo 2", response);
//     return response;
//   }
//   async findBlockedDates(mentorId: string): Promise<EBlockedDate[]> {
//     console.log("SlotRepository findBlockedDates steo 1", mentorId);
//     const response = await blockedModel.find({ mentorId: mentorId });
//     console.log("SlotRepository findBlockedDates steo 2", response);
//     return response;
//   }
// }
