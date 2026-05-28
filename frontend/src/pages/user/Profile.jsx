import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider } from '@mui/material';
import { Save, LockReset } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token, refreshToken } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState({ name: user?.name || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) return toast.error('Name cannot be empty');
    
    setUpdatingProfile(true);
    try {
      const res = await api.put('/auth/profile', { name: profileData.name });
      dispatch(loginSuccess({ token, refreshToken, user: res.data.data }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    
    setUpdatingPassword(true);
    try {
      await api.put('/auth/password', { 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | Vehicle Booking</title>
      </Helmet>
      <Box maxWidth="800px" mx="auto">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Account Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Profile Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  sx={{ mb: 3 }}
                  helperText="Email cannot be changed"
                />
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Account Type"
                  value={user?.role || ''}
                  disabled
                  sx={{ mb: 4 }}
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={<Save />} 
                  disabled={updatingProfile}
                  fullWidth
                >
                  {updatingProfile ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Password Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" onSubmit={handlePasswordUpdate}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  sx={{ mb: 3 }}
                  required
                  inputProps={{ minLength: 6 }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  sx={{ mb: 4 }}
                  required
                />
                
                <Button 
                  type="submit" 
                  color="warning"
                  variant="contained" 
                  startIcon={<LockReset />} 
                  disabled={updatingPassword}
                  fullWidth
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
