import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, useTheme } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7, Logout } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const appTitle = user?.role === 'Admin' ? 'Vehicle Booking — Admin Panel' : 'Vehicle Booking';

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
          {appTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {user && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold" lineHeight={1.2}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1}>
                  {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          <IconButton onClick={() => dispatch(toggleTheme())} color="inherit" aria-label="toggle theme">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Button color="error" variant="outlined" startIcon={<Logout />} onClick={handleLogout} size="small">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
