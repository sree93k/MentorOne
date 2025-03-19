import { UserRole } from '../contexts/AuthContext';

export interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

export interface AuthPageProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
}
