import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, CircularProgress, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const getStatusColor = (status) => {
  switch (status) {
    case 'Success': return 'success';
    case 'Canceled by Driver':
    case 'Canceled by Customer': return 'error';
    case 'Incomplete': return 'warning';
    case 'Driver Not Found': return 'default';
    default: return 'default';
  }
};

const UserBookings = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings for the logged-in user
      const response = await api.get(`/bookings/customer/${user.id}`);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Client-side pagination since endpoint might not support pagination natively for customer ID
  const paginatedBookings = bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Helmet>
        <title>My Bookings | Vehicle Booking</title>
      </Helmet>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            My Bookings
          </Typography>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchBookings} disabled={loading}>
            Refresh
          </Button>
        </Box>

        <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <TableContainer sx={{ maxHeight: '65vh' }}>
            <Table stickyHeader aria-label="user bookings table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pickup</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Drop</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Value (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      You have no bookings yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBookings.map((row) => (
                    <TableRow hover key={row._id || row.Booking_ID}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {row.Booking_ID || row._id?.substring(0, 10)}
                      </TableCell>
                      <TableCell>{row.Date}</TableCell>
                      <TableCell>{row.Vehicle_Type}</TableCell>
                      <TableCell>{row.Pickup_Location}</TableCell>
                      <TableCell>{row.Drop_Location}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.Booking_Status}
                          color={getStatusColor(row.Booking_Status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">₹{row.Booking_Value?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={bookings.length}
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

export default UserBookings;
