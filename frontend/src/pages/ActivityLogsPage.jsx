import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import { activityLogsAPI } from '../services/api';

const ActivityLogsPage = () => {
  // State for activity logs data and loading
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for filters
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    search: ''
  });
  
  // Fetch activity logs with current filters and pagination
  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1, // API uses 1-based indexing
        limit: rowsPerPage,
        sortField: 'createdAt',
        sortOrder: 'DESC',
        ...filters
      };
      
      const response = await activityLogsAPI.getAll(params);
      setActivityLogs(response.data.activityLogs);
      setTotalCount(response.data.pagination.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch activity logs when filters or pagination changes
  useEffect(() => {
    fetchActivityLogs();
  }, [page, rowsPerPage, filters]);
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset to first page when filters change
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  // Get action color
  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'primary';
      case 'delete':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Container maxWidth="100%">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" textAlign="left">
            Activity Logs
          </Typography>
        </Box>
        
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="entity-type-filter-label">Entity Type</InputLabel>
                <Select
                  labelId="entity-type-filter-label"
                  name="entityType"
                  value={filters.entityType}
                  onChange={handleFilterChange}
                  label="Entity Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="checkpoint">Checkpoint</MenuItem>
                  <MenuItem value="department">Department</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="head">Head</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="action-filter-label">Action</InputLabel>
                <Select
                  labelId="action-filter-label"
                  name="action"
                  value={filters.action}
                  onChange={handleFilterChange}
                  label="Action"
                >
                  <MenuItem value="">All Actions</MenuItem>
                  <MenuItem value="create">Create</MenuItem>
                  <MenuItem value="update">Update</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="search"
                label="Search"
                variant="outlined"
                size="small"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by user or details"
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Activity Logs Table */}
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Entity Type</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No activity logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.createdAt)}</TableCell>
                          <TableCell>{log.userName || 'NA'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={log.entityType.charAt(0).toUpperCase() + log.entityType.slice(1)} 
                              color="secondary" 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={log.action.charAt(0).toUpperCase() + log.action.slice(1)} 
                              color={getActionColor(log.action)} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            {log.details ? (
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            ) : 'No details'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ActivityLogsPage;