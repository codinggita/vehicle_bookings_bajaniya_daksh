import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataStart, fetchBookingsSuccess, fetchDataFailure } from '../../store/slices/dataSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const getStatusColor = (status) => {
  switch (status) {
    case 'Success': return 'success';
    case 'Canceled by Driver':
    case 'Canceled by Customer': return 'error';
    case 'Incomplete': return 'warning';
    default: return 'default';
  }
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, totalBookings, loading } = useSelector((state) => state.data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBookings = async () => {
    dispatch(fetchDataStart());
    try {
      // API expects page 1-indexed
      const response = await api.get(`/bookings?page=${page + 1}&limit=${rowsPerPage}`);
      // Assuming response.data contains { success: true, count, data, total } or similar
      // The exact format depends on your backend, adjusting based on common practices:
      const data = response.data.data || [];
      const total = response.data.total || data.length; 
      
      dispatch(fetchBookingsSuccess({ data, total }));
    } catch (error) {
      dispatch(fetchDataFailure(error.message));
      toast.error('Failed to fetch bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/admin/bookings/${id}`);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Vehicle Booking</title>
      </Helmet>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Booking Management
        </Typography>

        <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', mt: 3, borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: '65vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Vehicle Type</TableCell>
                  <TableCell>Pickup Area</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Value (₹)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>Loading...</TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>No bookings found.</TableCell>
                  </TableRow>
                ) : (
                  bookings.map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell>{row.Booking_ID || row._id.substring(0, 8)}</TableCell>
                      <TableCell>{row.Customer_ID?.name || row.Customer_ID || 'N/A'}</TableCell>
                      <TableCell>{row.Vehicle_Type}</TableCell>
                      <TableCell>{row.Pickup_Location}</TableCell>
                      <TableCell>
                        <Chip label={row.Booking_Status} color={getStatusColor(row.Booking_Status)} size="small" />
                      </TableCell>
                      <TableCell align="right">{row.Booking_Value}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton color="primary" size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" size="small" onClick={() => handleDelete(row._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalBookings || 100} // fallback if total isn't sent
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default AdminBookings;
