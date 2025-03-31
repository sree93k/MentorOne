import  {Document,Schema, ObjectId } from "mongoose";


export interface EWorkExperience extends Document{
    _id:ObjectId | null;
    company:string | null;
    jobRole:string | null;
    startDate:Date | null
    endDate:string | null;
    city:string | null;
} 