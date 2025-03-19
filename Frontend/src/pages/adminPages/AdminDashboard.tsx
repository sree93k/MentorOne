import React from 'react';
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
} from '@mui/material';
import {
  UsersIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { DashboardProps } from '../../types/dashboard';

const AdminDashboard: React.FC<DashboardProps> = () => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" className="mb-6 font-bold">
          Admin Dashboard
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h6">1,234</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Active Mentors
                  </Typography>
                  <Typography variant="h6">156</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Pending Approvals
                  </Typography>
                  <Typography variant="h6">23</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <Typography variant="body2" color="textSecondary">
                    Active Sessions
                  </Typography>
                  <Typography variant="h6">89</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Pending Approvals */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Pending Mentor Approvals
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem
                      key={item}
                      className="border-b last:border-b-0"
                      secondaryAction={
                        <div className="space-x-2">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            className="bg-primary hover:bg-primary/90"
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                          >
                            Reject
                          </Button>
                        </div>
                      }
                    >
                      <ListItemText
                        primary={`John Doe ${item}`}
                        secondary="Senior Software Engineer at Tech Corp"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Recent Activity
                </Typography>
                <List>
                  {[1, 2, 3, 4].map((item) => (
                    <ListItem
                      key={item}
                      className="border-b last:border-b-0"
                    >
                      <ListItemText
                        primary={`New mentor registration: Sarah Smith ${item}`}
                        secondary="2 hours ago"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
