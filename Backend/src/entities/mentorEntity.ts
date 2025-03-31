import  {Document,Schema, ObjectId } from "mongoose";


export interface EMentor extends Document {
    _id: ObjectId | null;
    bio: string | null;
    skills: string[] | null;
    selfIntro: string | null; 
    achievements: string[] | null; 
    services: ObjectId[] | null; 
    createdAt: Date | null;
    updatedAt: Date | null;
  }
