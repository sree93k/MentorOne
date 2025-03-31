import  {Document,Schema, ObjectId } from "mongoose";


export interface ECollegeExperience extends Document{
    _id:ObjectId | null;
    course:string | null;
    specializedIn: string | null;
    courseStartDate:Date | null;
    courseEndDate:Date | null
    collegeName:string | null;
    city:string | null;
} 