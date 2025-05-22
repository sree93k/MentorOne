import { ESchoolExperience } from "../../entities/schoolEntity";
import { ICareerRepository } from "../interface/ICareerRepositoty";
import SchoolExperience from "../../models/schoolExperienceModel";
import CollegeExperience from "../../models/CollegeExperienceModel";
import WorkExperience from "../../models/professionalExperienceModel";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { EGoals } from "../../entities/goalsEntity";
import Goals from "../../models/goalModel";

export default class CareerRepository implements ICareerRepository {
  async schoolStudentFormDataCreate(
    formData: ESchoolExperience,
    id: string
  ): Promise<ESchoolExperience | null> {
    console.log("school repo 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", formData);
    const newSchoolExperience = new SchoolExperience(formData);
    console.log(
      "school repo 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      newSchoolExperience
    );
    const result = await newSchoolExperience.save();
    console.log("school repo 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
    return result; // Ensure null if save fails
  }

  async collegeStudentFormDataCreate(
    formData: ECollegeExperience,
    id: string
  ): Promise<ECollegeExperience | null> {
    console.log("college repo 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", formData);
    const newCollegeExperience = new CollegeExperience(formData);
    console.log(
      "college repo 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      newCollegeExperience
    );
    const result = await newCollegeExperience.save();
    console.log("college repo 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
    return result;
  }

  async professionalFormDataCreate(
    formData: EWorkExperience & { userType: string }, // Add userType
    id: string
  ): Promise<(EWorkExperience & { userType: string }) | null> {
    console.log("professional repo 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", formData);
    const newWorkExperience = new WorkExperience(formData);
    console.log(
      "professional repo 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      newWorkExperience
    );
    const result = await newWorkExperience.save();
    console.log("professional repo 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
    return result;
    //  ? { ...result.toObject(), userType: formData.userType } : null;
  }

  async createGoalDatas(data: {
    careerGoals: string;
    interestedNewcareer: string;
    goals: string[];
  }): Promise<EGoals> {
    console.log("Repo create goal data step 1", data);
    const newGoals = new Goals({
      goals: data.goals,
      careerGoals: data.careerGoals,
      interestedNewcareer: data.interestedNewcareer,
    });
    console.log("Repo create goal data step 2", newGoals);
    const result = await newGoals.save();
    console.log("Repo create goal data step 2", result);
    return result;
  }

  async createMentee(data: {
    careerGoals: string;
    interestedNewcareer: string;
    goals: string[];
  }): Promise<EGoals> {
    console.log("Repo create goal data step 1", data);
    const newGoals = new Goals({
      goals: data.goals,
      careerGoals: data.careerGoals,
      interestedNewcareer: data.interestedNewcareer,
    });
    console.log("Repo create goal data step 2", newGoals);
    const result = await newGoals.save();
    console.log("Repo create goal data step 2", result);
    return result;
  }
}
