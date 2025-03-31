import { extend } from "joi";
import  {Document,Schema, ObjectId } from "mongoose";


export interface ESchoolExperience extends Document{
    _id:ObjectId | null;
    schoolName: string | null;
    class: number | null;
    city: string | null;
    startDate: Date | null;
    endDate: Date | null;
  }

  