export interface UpdateUserDataPayload {
  userType: string;
  schoolName?: string;
  class?: string;
  course?: string;
  specializedIn?: string;
  collegeName?: string;
  startDate?: string;
  endDate?: string;
  experience?: string;
  jobRole?: string;
  company?: string;
  currentlyWorking?: boolean;
  city: string;
  careerGoals?: string;
  interestedNewcareer?: string[];
  goals?: string[];
}

export interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  companyBadge: string;
  isBlocked: boolean;
  isApproved: string;
  bio?: string;
  skills?: string[];
  services?: {
    type: string;
    title: string;
    description: string;
    duration: string;
    price: number;
  }[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

export interface ApiResponse {
  status: number;
  data: any;
  message: string;
  total?: number;
}

export interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  amount: number;
  duration: number;
  type: string;
  technology?: string;
  digitalProductType?: string;
  oneToOneType?: string;
  fileUrl?: string;
  exclusiveContent?: any[];
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
  mentorId: string;
  mentorName: string;
  mentorProfileImage: string;
  bookingCount: number;
  averageRating: number;
}

export interface MentorData {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  mentorId: {
    _id: string;
    bio: string;
    skills: string[];
  };
  isBlocked: boolean;
  isApproved: string;
  bookingCount: number;
  averageRating: number;
}

export interface Testimonial {
  _id: string;
  menteeId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  mentorId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  serviceId: {
    _id: string;
    title: string;
  };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: Date;
}
export interface DashboardData {
  topServices: Service[];
  topMentors: MentorData[];
  topTestimonials: Testimonial[];
}
