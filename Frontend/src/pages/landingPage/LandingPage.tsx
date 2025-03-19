import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import SimpleContainer from '../../common/Container';
const features = [
  {
    icon: AcademicCapIcon,
    title: 'Expert Mentorship',
    description: 'Connect with industry professionals and gain valuable insights',
  },
  {
    icon: UserGroupIcon,
    title: 'Personalized Matching',
    description: 'Find the perfect mentor based on your goals and interests',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Seamless Communication',
    description: 'Stay connected through our integrated messaging platform',
  },
  {
    icon: ChartBarIcon,
    title: 'Progress Tracking',
    description: 'Monitor your growth with detailed progress analytics',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    avatar: 'SJ',
    content: 'Mentor One helped me transition into tech. My mentor provided invaluable guidance throughout my journey.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    avatar: 'MC',
    content: 'The mentorship I received was transformative. I gained practical insights that accelerated my career growth.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    avatar: 'ER',
    content: 'Finding a mentor in my field was easy. The platform\'s matching system is spot-on!',
    rating: 5,
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const renderStars = (rating: number) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {[...Array(rating)].map((_, index) => (
        <StarIcon key={index} style={{ width: '14px', height: '14px' }} className="text-yellow-400" />
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'black',
          color: 'white',
          pt: { xs: 15, md: 22 },
          pb: { xs: 10, md: 18 },
          mt: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 600, mx: 'auto', px: { xs: 2, md: 0 } }}>
                <Typography 
                  variant="h1" 
                  sx={{
                    fontSize: { xs: '2.75rem', md: '3.75rem' },
                    fontWeight: 800,
                    mb: 3,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Find Your Perfect Mentor
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{
                    mb: 5,
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  Connect with experienced professionals who can guide you towards success
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    px: 6,
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto', 
                  px: { xs: 2, md: 0 },
                  transform: { xs: 'scale(0.9)', md: 'scale(1)' },
                  transition: 'transform 0.3s ease'
                }}
              >
                <img
                  src="/Banner1.jpg"
                  alt="Mentorship"
                  style={{ 
                    width: '590px', 
                    height: 'auto', 
                    maxHeight: 500,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.25rem', md: '2.75rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Why Choose MENTOR ONE?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 8,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6
            }}
          >
            Experience the power of personalized mentorship with our comprehensive platform
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      sx={{
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        bgcolor: 'primary.main',
                        mx: 'auto'
                      }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        fontSize: '1.25rem',
                        color: 'text.primary'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.25rem', md: '2.75rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 8,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6
            }}
          >
            Hear from our community members who have transformed their careers
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '1.125rem',
                          fontWeight: 600
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2,
                        color: 'text.primary',
                        fontStyle: 'italic',
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    {renderStars(testimonial.rating)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'black',
          color: 'white',
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h2" 
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.25rem', md: '2.75rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{
                mb: 5,
                color: 'rgba(255,255,255,0.85)',
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Join our community of mentors and mentees today
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: 'black',
                px: 6,
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingPage;
