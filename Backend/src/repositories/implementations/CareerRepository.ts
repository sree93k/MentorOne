import { ESchoolExperience } from "../../entities/schoolEntity";
import { ICareerRepository } from "../interface/ICareerRepositoty";
import SchoolExperience from "../../models/schoolExperienceModel";
import CollegeExperience from "../../models/CollegeExperienceModel";
import WorkExperience from "../../models/professionalExperienceModel";
import { EWorkExperience } from "../../entities/professionalEnitity";
import { ECollegeExperience } from "../../entities/collegeEntity";
import { EGoals } from "../../entities/goalsEntity";
import Goals from "../../models/goalModel";
import { ApiError } from "../../middlewares/errorHandler";
import { HttpStatus } from "../../constants/HttpStatus";

export default class CareerRepository implements ICareerRepository {
  async schoolStudentFormDataCreate(
    formData: ESchoolExperience,
    id: string
  ): Promise<ESchoolExperience | null> {
    try {
      console.log(
        "school repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newSchoolExperience = new SchoolExperience(formData);
      console.log(
        "school repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newSchoolExperience
      );
      const result = await newSchoolExperience.save();
      console.log("school repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      return result;
    } catch (error) {
      console.error("Error creating school experience:", error);
      return null;
    }
  }

  async updateSchoolExperience(
    id: string,
    formData: Partial<ESchoolExperience>
  ): Promise<ESchoolExperience | null> {
    try {
      console.log("school repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await SchoolExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log("school repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (!result) {
        console.error(`School experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating school experience:", error);
      return null;
    }
  }

  async collegeStudentFormDataCreate(
    formData: ECollegeExperience,
    id: string
  ): Promise<ECollegeExperience | null> {
    try {
      console.log(
        "college repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newCollegeExperience = new CollegeExperience(formData);
      console.log(
        "college repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newCollegeExperience
      );
      const result = await newCollegeExperience.save();
      console.log("college repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      return result;
    } catch (error) {
      console.error("Error creating college experience:", error);
      return null;
    }
  }

  async updateCollegeExperience(
    id: string,
    formData: Partial<ECollegeExperience>
  ): Promise<ECollegeExperience | null> {
    try {
      console.log("college repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await CollegeExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log("college repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
      if (!result) {
        console.error(`College experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating college experience:", error);
      return null;
    }
  }

  async professionalFormDataCreate(
    formData: EWorkExperience & { userType: string },
    id: string
  ): Promise<(EWorkExperience & { userType: string }) | null> {
    try {
      console.log(
        "professional repo create 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        formData
      );
      const newWorkExperience = new WorkExperience(formData);
      console.log(
        "professional repo create 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        newWorkExperience
      );
      const result = await newWorkExperience.save();
      console.log(
        "professional repo create 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        result
      );
      return result;
    } catch (error) {
      console.error("Error creating professional experience:", error);
      return null;
    }
  }

  async updateProfessionalExperience(
    id: string,
    formData: Partial<EWorkExperience & { userType: string }>
  ): Promise<(EWorkExperience & { userType: string }) | null> {
    try {
      console.log("professional repo update 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>", {
        id,
        formData,
      });
      const result = await WorkExperience.findByIdAndUpdate(id, formData, {
        new: true,
      });
      console.log(
        "professional repo update 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        result
      );
      if (!result) {
        console.error(`Professional experience not found for id: ${id}`);
      }
      return result;
    } catch (error) {
      console.error("Error updating professional experience:", error);
      return null;
    }
  }

  async createGoalDatas(data: {
    careerGoals: string;
    interestedNewcareer: string;
    goals: string[];
  }): Promise<EGoals> {
    try {
      console.log("Repo create goal data step 1", data);
      const newGoals = new Goals({
        goals: data.goals,
        careerGoals: data.careerGoals,
        interestedNewcareer: data.interestedNewcareer,
      });
      console.log("Repo create goal data step 2", newGoals);
      const result = await newGoals.save();
      console.log("Repo create goal data step 3", result);
      return result;
    } catch (error) {
      console.error("Error creating goal data:", error);
      throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid input");
    }
  }

  async createMentee(data: {
    careerGoals: string;
    interestedNewcareer: string;
    goals: string[];
  }): Promise<EGoals> {
    try {
      console.log("Repo create mentee data step 1", data);
      const newGoals = new Goals({
        goals: data.goals,
        careerGoals: data.careerGoals,
        interestedNewcareer: data.interestedNewcareer,
      });
      console.log("Repo create mentee data step 2", newGoals);
      const result = await newGoals.save();
      console.log("Repo create mentee data step 3", result);
      return result;
    } catch (error) {
      console.error("Error creating mentee data:", error);
      throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid input");
    }
  }
}
