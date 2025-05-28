import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Avatar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from "../assets/images/logo.png";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mastersAnchorEl, setMastersAnchorEl] = useState(null);
  
  const isMenuOpen = Boolean(anchorEl);
  const isMastersMenuOpen = Boolean(mastersAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMastersMenuOpen = (event) => {
    setMastersAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMastersAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { minWidth: 180 }
      }}
    >
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        Dashboard
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mastersMenuId = 'primary-masters-menu';
  const renderMastersMenu = (
    <Menu
      anchorEl={mastersAnchorEl}
      id={menuId}
      keepMounted
      open={isMastersMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { minWidth: 180 }
      }}
    >
    <MenuItem onClick={() => { navigate('/masters/department'); handleMenuClose(); }}>
      Department
    </MenuItem>
    <MenuItem onClick={() => { navigate('/masters/type'); handleMenuClose(); }}>
      Type
    </MenuItem>
    <MenuItem onClick={() => { navigate('/masters/head'); handleMenuClose(); }}>
      Head
    </MenuItem>
  </Menu>
  )
  
  return (
    <>
      <AppBar position="fixed" color='white'>
        <Toolbar sx={{justifyContent: 'space-between'}}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to={isAuthenticated ? '/dashboard' : '/'} 
            sx={{ 
              flexGrow: 0, 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            <img src={logoImage} alt="Workflow Logo" style={{ height: 40, marginRight: 8 }} />
          </Typography>
          
          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                  <>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      aria-controls={mastersMenuId}
                      aria-haspopup="true"
                      to="/projects"
                    >Projects</Button>
                  </>

                {user?.role === 'super_admin' && (
                  <>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      aria-controls={mastersMenuId}
                      aria-haspopup="true"
                      onClick={handleMastersMenuOpen}
                    >
                      Masters
                    </Button>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      to="/users"
                    >
                      User Management
                    </Button>
                    <Button 
                      color="inherit" 
                      component={RouterLink} 
                      to="/activity-logs"
                    >
                      Activity Logs
                    </Button>
                  </>
                )}
                
                <IconButton
                  edge="end"
                  aria-label="account"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'secondary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMastersMenu}
    </>
  );
};

export default Header;