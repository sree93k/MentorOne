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
} from '@mui/material';
import {
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const MentorDashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" className="mb-6 font-bold">
          Welcome, {user?.name || 'Mentor'}!
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Active Mentees
                  </Typography>
                  <Typography variant="h6">12</Typography>
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
                    Upcoming Sessions
                  </Typography>
                  <Typography variant="h6">5</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <StarIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Average Rating
                  </Typography>
                  <Typography variant="h6">4.8/5.0</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Total Sessions
                  </Typography>
                  <Typography variant="h6">156</Typography>
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
                  Upcoming Sessions
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem
                      key={item}
                      className="border-b last:border-b-0"
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="mr-4">JS</Avatar>
                        <ListItemText
                          primary={`Career Guidance Session with John Smith ${item}`}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                Today at 3:00 PM
                              </Typography>
                              <br />
                              <Chip
                                size="small"
                                label="Career Development"
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

          {/* Mentee Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Mentee Progress
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem
                      key={item}
                      className="border-b last:border-b-0"
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="mr-4">AS</Avatar>
                        <ListItemText
                          primary={`Alice Smith ${item}`}
                          secondary={
                            <React.Fragment>
                              <div className="flex items-center mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${65 + item * 5}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-600">
                                  {65 + item * 5}%
                                </span>
                              </div>
                            </React.Fragment>
                          }
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          className="ml-4"
                        >
                          Review
                        </Button>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Resources Shared */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Recently Shared Resources
                </Typography>
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item}>
                      <Paper className="p-4">
                        <Typography variant="subtitle1" className="font-medium mb-2">
                          Career Development Guide {item}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mb-3">
                          Shared with 5 mentees • 2 days ago
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          className="text-primary"
                        >
                          View Resource
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

export default MentorDashboard;
