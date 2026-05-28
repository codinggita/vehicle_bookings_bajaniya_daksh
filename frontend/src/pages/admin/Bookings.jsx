import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Tooltip, TextField, InputAdornment,
  CircularProgress, Button, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Edit, Delete, Search, Refresh } from '@mui/icons-material';
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
    case 'Driver Not Found': return 'default';
    default: return 'default';
  }
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, totalBookings, loading } = useSelector((state) => state.data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [deleteDialogId, setDeleteDialogId] = useState(null);

  const fetchBookings = async () => {
    dispatch(fetchDataStart());
    try {
      // Use the auth-protected admin endpoint
      const response = await api.get(`/admin/bookings?page=${page + 1}&limit=${rowsPerPage}`);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
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

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialogId) return;
    try {
      await api.delete(`/admin/bookings/${deleteDialogId}`);
      toast.success('Booking deleted successfully');
      setDeleteDialogId(null);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const filteredBookings = search
    ? bookings.filter(
        (b) =>
          (b.Booking_ID || '').toLowerCase().includes(search.toLowerCase()) ||
          (b.Customer_ID || '').toLowerCase().includes(search.toLowerCase()) ||
          (b.Vehicle_Type || '').toLowerCase().includes(search.toLowerCase()) ||
          (b.Pickup_Location || '').toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Vehicle Booking</title>
      </Helmet>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Booking Management
          </Typography>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchBookings} disabled={loading}>
            Refresh
          </Button>
        </Box>

        <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          {/* Search bar */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              size="small"
              placeholder="Search by ID, customer, vehicle, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 360 } }}
            />
          </Box>

          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table stickyHeader aria-label="bookings table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pickup</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Drop</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Value (₹)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((row) => (
                    <TableRow hover key={row._id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {row.Booking_ID || row._id?.substring(0, 10)}
                      </TableCell>
                      <TableCell>{row.Customer_ID || 'N/A'}</TableCell>
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
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => setDeleteDialogId(row._id)}
                          >
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
            count={totalBookings || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialogId} onClose={() => setDeleteDialogId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to permanently delete this booking?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminBookings;
