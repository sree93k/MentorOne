import mongoose,{Schema,Document,ObjectId} from "mongoose";


export interface EUsers extends Document {
    _id: ObjectId | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    phone:String | null;
    dob: Date | null;
    gender:string | null;
    role:string | null;
    profilePicture: string | null;
    refreshToken:string | null;
    isBlocked:Boolean | null;
    createdAt:Date |null;

}
