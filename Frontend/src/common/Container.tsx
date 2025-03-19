import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


const SimpleContainer: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', padding:"10px"}} >
        <h1>hii</h1>
            </Box>
      </Container>
    </React.Fragment>
  );
}

export default SimpleContainer;