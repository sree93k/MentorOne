import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link,useNavigate } from 'react-router-dom';


const pages = ['About', 'Blog', 'Community'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const navigate=useNavigate()
  
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: '70px' }}>
          {/* Logo section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '40px', height: 'auto', marginRight: '10px' }} />
            <img src="/brandlogo.png" alt="Brand" style={{ width: '120px', height: 'auto' }} />
          </Box>

          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ color: 'black' }}>{page}</Typography>
                </MenuItem>
              ))}
              <MenuItem>
                <Button variant="contained" fullWidth sx={{ backgroundColor: '#1976d2' }}>
                  Get Started
                </Button>
              </MenuItem>
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            {pages.map((page) => (
              <Link 
                key={page} 
                to={`/${page.toLowerCase()}`}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    color: 'black',
                    '&:hover': {
                      color: '#1976d2',
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
            <Button 
              variant="contained" 
              sx={{
                backgroundColor: '#000000',
                '&:hover': {
                  backgroundColor: '#ffffff'
                }
              }}
              onClick={handleGetStarted}
            >
                <Typography sx={{ color: '#fffff', '&:hover':{
                    color: '#000000'
                } }}>Get Started</Typography>
              
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
