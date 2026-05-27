import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { DirectionsCar, CheckCircle, Cancel, ErrorOutline } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    cancelled: 0,
    incomplete: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalRes, successRes, cancelledRes, incompleteRes] = await Promise.all([
          api.get('/stats/total-bookings'),
          api.get('/stats/success-rides'),
          api.get('/stats/cancelled-rides'),
          api.get('/stats/incomplete-rides')
        ]);

        setStats({
          total: totalRes.data.data,
          success: successRes.data.data,
          cancelled: cancelledRes.data.data,
          incomplete: incompleteRes.data.data,
        });
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const chartData = [
    { name: 'Success', value: stats.success, color: '#4caf50' },
    { name: 'Cancelled', value: stats.cancelled, color: '#f44336' },
    { name: 'Incomplete', value: stats.incomplete, color: '#ff9800' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Vehicle Booking</title>
      </Helmet>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Analytics Overview
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Bookings" value={stats.total} icon={<DirectionsCar fontSize="large" />} color="#2196f3" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Successful Rides" value={stats.success} icon={<CheckCircle fontSize="large" />} color="#4caf50" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Cancelled Rides" value={stats.cancelled} icon={<Cancel fontSize="large" />} color="#f44336" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Incomplete Rides" value={stats.incomplete} icon={<ErrorOutline fontSize="large" />} color="#ff9800" />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Booking Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdminDashboard;
