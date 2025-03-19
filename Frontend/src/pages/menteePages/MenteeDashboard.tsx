import React from 'react';
import { DashboardProps } from '../../types/dashboard';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const MenteeDashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" className="mb-6 font-bold">
          Welcome Back, {user?.name || 'Mentee'}!
        </Typography>

        {/* Progress Overview */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Learning Progress
                  </Typography>
                  <Typography variant="h6">75%</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Sessions Completed
                  </Typography>
                  <Typography variant="h6">12</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Resources Accessed
                  </Typography>
                  <Typography variant="h6">24</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <RocketLaunchIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Goals Achieved
                  </Typography>
                  <Typography variant="h6">8/10</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Upcoming Sessions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Your Upcoming Sessions
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem
                      key={item}
                      className="border-b last:border-b-0"
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="mr-4">
                          {['JD', 'MS', 'RK'][item - 1]}
                        </Avatar>
                        <ListItemText
                          primary={`1:1 Session with ${['John Doe', 'Mary Smith', 'Robert King'][item - 1]}`}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                {['Tomorrow', 'In 2 days', 'Next week'][item - 1]} at {['2:00 PM', '3:30 PM', '11:00 AM'][item - 1]}
                              </Typography>
                              <br />
                              <Chip
                                size="small"
                                label={['Career Growth', 'Technical Skills', 'Leadership'][item - 1]}
                                className="mt-1"
                                color="primary"
                              />
                            </React.Fragment>
                          }
                        />
                        <Button
                          variant="contained"
                          size="small"
                          className="bg-primary hover:bg-primary/90 ml-4"
                        >
                          Join
                        </Button>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Path Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Your Learning Path
                </Typography>
                <List>
                  {[
                    { skill: 'Technical Leadership', progress: 85 },
                    { skill: 'System Design', progress: 60 },
                    { skill: 'Communication', progress: 75 },
                    { skill: 'Project Management', progress: 45 },
                  ].map((item, index) => (
                    <ListItem key={index} className="block">
                      <div className="flex justify-between mb-1">
                        <Typography variant="body2">{item.skill}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.progress}%
                        </Typography>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        className="mb-4"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Resources and Materials */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Recommended Resources
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Leadership Fundamentals', type: 'Course' },
                    { title: 'Technical Interview Prep', type: 'Guide' },
                    { title: 'System Design Patterns', type: 'Workshop' },
                    { title: 'Communication Skills', type: 'Video Series' },
                  ].map((resource, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Paper className="p-4">
                        <Typography variant="subtitle1" className="font-medium mb-2">
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-3">
                          {resource.type} • Recommended by your mentor
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          className="text-primary"
                        >
                          Start Learning
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MenteeDashboard;
