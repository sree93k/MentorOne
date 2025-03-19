import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Box, Container, FormControl, InputLabel, Select, MenuItem, CircularProgress, SelectChangeEvent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPageProps } from '../../types/dashboard';
import { UserRole } from '../../contexts/AuthContext';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  expertise?: string;
  experience?: number;
}

const Register: React.FC<AuthPageProps> = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mentee',
    expertise: '',
    experience: undefined,
  });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual registration API call
      // For now, we'll simulate registration and auto-login
      console.log('Registration data:', formData);
      
      // Simulate successful registration
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to home after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" className="text-center mb-4">
            Create your Mentor One Account
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleTextFieldChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleTextFieldChange}
                disabled={loading}
              />
            </div>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleTextFieldChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleTextFieldChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleTextFieldChange}
              disabled={loading}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">I want to join as</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="I want to join as"
                onChange={handleRoleChange}
                disabled={loading}
              >
                <MenuItem value="mentee">Mentee - I'm looking for guidance</MenuItem>
                <MenuItem value="mentor">Mentor - I want to share my expertise</MenuItem>
              </Select>
            </FormControl>

            {formData.role === 'mentor' && (
              <div className="space-y-4">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="expertise"
                  label="Areas of Expertise"
                  id="expertise"
                  multiline
                  rows={2}
                  helperText="List your main areas of expertise (e.g., Software Development, Product Management)"
                  value={formData.expertise}
                  onChange={handleTextFieldChange}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="experience"
                  label="Years of Experience"
                  type="number"
                  id="experience"
                  value={formData.experience || ''}
                  onChange={handleTextFieldChange}
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Already have an account? Sign In
              </Link>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  fullWidth
                  variant="outlined"
                  className="border-gray-300"
                  disabled={loading}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  className="border-gray-300"
                  disabled={loading}
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
