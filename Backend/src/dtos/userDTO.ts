export interface UserResponseDto {
  userId: string;
  name: string;
  email: string;
  role: string[];
  isBlocked: boolean;
  profileImage?: string;
}
