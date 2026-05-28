import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { DirectionsCar, CheckCircle, Cancel } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2 }}>
    <Box>
      <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" textTransform="uppercase">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{ backgroundColor: `${color}20`, p: 1.5, borderRadius: '50%', color: color, display: 'flex' }}>
      {icon}
    </Box>
  </Paper>
);

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    cancelled: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/bookings/customer/${user.id}`);
        const bookings = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        const successCount = bookings.filter(b => b.Booking_Status === 'Success').length;
        const cancelledCount = bookings.filter(b => b.Booking_Status?.includes('Cancel')).length;

        setStats({
          total: bookings.length,
          success: successCount,
          cancelled: cancelledCount,
        });

        // Take last 5 bookings
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Vehicle Booking</title>
      </Helmet>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Here is an overview of your booking activity.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard title="Total Bookings" value={stats.total} icon={<DirectionsCar fontSize="large" />} color="#2196f3" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Successful Rides" value={stats.success} icon={<CheckCircle fontSize="large" />} color="#4caf50" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Cancelled Rides" value={stats.cancelled} icon={<Cancel fontSize="large" />} color="#f44336" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Activity
          </Typography>
          {recentBookings.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography color="textSecondary">No recent bookings found.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {recentBookings.map((booking) => (
                <Grid item xs={12} key={booking._id || booking.Booking_ID}>
                  <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {booking.Pickup_Location} → {booking.Drop_Location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Vehicle: {booking.Vehicle_Type} | Date: {booking.Date}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main">
                        ₹{booking.Booking_Value?.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: booking.Booking_Status === 'Success' ? 'success.main' : 
                               booking.Booking_Status?.includes('Cancel') ? 'error.main' : 'warning.main',
                        fontWeight: 'bold'
                      }}>
                        {booking.Booking_Status}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserDashboard;
