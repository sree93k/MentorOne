import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Box, Container, CircularProgress } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPageProps } from '../../types/dashboard';

const AdminLogin: React.FC<AuthPageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      const from = (location.state as { from: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
            Welcome Master One ! 
          </Typography>
          <Typography component="h2" variant="h5" className="text-center mb-4">
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="current-password"
              className="mb-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
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
                'Sign In'
              )}
            </Button>
            
           
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
