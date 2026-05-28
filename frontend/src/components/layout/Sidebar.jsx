import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, useTheme, Toolbar } from '@mui/material';
import { Dashboard, DirectionsCar, Person } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const drawerWidth = 260;

  const adminMenu = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Manage Bookings', icon: <DirectionsCar />, path: '/admin/bookings' },
    { text: 'My Profile', icon: <Person />, path: '/profile' },
  ];

  const userMenu = [
    { text: 'My Dashboard', icon: <Dashboard />, path: '/user/dashboard' },
    { text: 'My Bookings', icon: <DirectionsCar />, path: '/user/bookings' },
    { text: 'My Profile', icon: <Person />, path: '/profile' },
  ];

  const menuItems = user?.role === 'Admin' ? adminMenu : userMenu;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Toolbar /> {/* Spacer for Navbar */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
                  borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ fontWeight: isSelected ? 'bold' : 'normal' }} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
