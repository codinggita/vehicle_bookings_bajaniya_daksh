import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Placeholders for Navbar and Sidebar to be built in Phase 3
const Navbar = () => <Box sx={{ height: '64px', borderBottom: '1px solid #e0e0e0', p: 2 }}>Navbar</Box>;
const Sidebar = () => <Box sx={{ width: '250px', borderRight: '1px solid #e0e0e0', p: 2 }}>Sidebar</Box>;

const MainLayout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {sidebarOpen && <Sidebar />}
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto', p: 3, backgroundColor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Global Toaster for notifications */}
      <Toaster position="top-right" />
    </Box>
  );
};

export default MainLayout;
