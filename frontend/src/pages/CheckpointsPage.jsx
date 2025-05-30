import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { checkpointsAPI, departmentsAPI, typesAPI, headsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CheckpointsPage = () => {
  // State for checkpoints data and loading
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme()
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for sorting
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  // State for filters
  const [filters, setFilters] = useState({
    typeId: '',
    departmentId: '',
    headId: '',
    search: ''
  });
  
  // State for master data
  const [heads, setHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [types, setTypes] = useState([]);
  
  const { user } = useAuth();
  // Fetch checkpoints with current filters, pagination, and sorting
  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1, // API uses 1-based indexing
        limit: rowsPerPage,
        sortField: orderBy,
        sortOrder: order.toUpperCase(),
        ...filters
      };
      
      const response = await checkpointsAPI.getAll(params);
      setCheckpoints(response.data.checkpoints);
      setTotalCount(response.data.pagination.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching checkpoints:', err);
      setError('Failed to load checkpoints. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch master data
  const fetchMasterData = async () => {
    try {
      const [headsResponse, departmentsResponse, typesResponse] = await Promise.all([
        headsAPI.getAll(),
        departmentsAPI.getAll(),
        typesAPI.getAll()
      ]);
      
      setHeads(headsResponse.data);
      setDepartments(departmentsResponse.data);
      setTypes(typesResponse.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchMasterData();
  }, []);
  
  // Fetch checkpoints when filters, pagination, or sorting changes
  useEffect(() => {
    fetchCheckpoints();
  }, [page, rowsPerPage, orderBy, order, filters]);
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
  
  // Handle delete checkpoint
  const handleDeleteCheckpoint = async (id) => {
    if (window.confirm('Are you sure you want to delete this checkpoint?')) {
      try {
        await checkpointsAPI.delete(id);
        fetchCheckpoints(); // Refresh the list
      } catch (err) {
        console.error('Error deleting checkpoint:', err);
        alert('Failed to delete checkpoint. Please try again.');
      }
    }
  };
  
  return (
    <Container maxWidth="100%">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Checkpoint Management
          </Typography>
          {user?.role === 'super_admin' && (
          <Button
            component={Link}
            to="/checkpoints/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add New Checkpoint
          </Button>)}
        </Box>
        
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="head-filter-label">Head</InputLabel>
                <Select
                  labelId="haed-filter-label"
                  name="headId"
                  value={filters.headId}
                  onChange={handleFilterChange}
                  label="Head"
                >
                  <MenuItem value="">All Heads</MenuItem>
                  {heads.map(head => (
                    <MenuItem key={head.id} value={head.id}>
                      {head.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  name="typeId"
                  value={filters.typeId}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {types.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="department-filter-label">Department</InputLabel>
                <Select
                  labelId="department-filter-label"
                  name="departmentId"
                  value={filters.departmentId}
                  onChange={handleFilterChange}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                name="search"
                label="Search"
                variant="outlined"
                size="small"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by head or checkpoint"
              />
            </Grid>            
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-start' } }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFilters({
                    typeId: '',
                    departmentId: '',
                    search: ''
                  });
                }}
              >
                Clear Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={1}/>

          </Grid>
        </Paper>
        
        {/* Checkpoints Table */}
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
              <Button sx={{ mt: 2 }} variant="outlined" onClick={fetchCheckpoints}>
                Retry
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                    <TableCell>Checkpoint</TableCell>
                      <TableCell sx={{minWidth: '150px'}}>URL</TableCell>
                      {/* <TableCell>
                        <TableSortLabel
                          active={orderBy === 'head'}
                          direction={orderBy === 'head' ? order : 'asc'}
                          onClick={() => handleRequestSort('head')}
                        >
                          Head
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'type'}
                          direction={orderBy === 'type' ? order : 'asc'}
                          onClick={() => handleRequestSort('type')}
                        >
                          Type
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'department'}
                          direction={orderBy === 'department' ? order : 'asc'}
                          onClick={() => handleRequestSort('department')}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell> */}
                      <TableCell sx={{minWidth: '200px'}}>
                        <TableSortLabel
                          direction={orderBy === 'createdAt' ? order : 'asc'}
                          onClick={() => handleRequestSort('createdAt')}
                        >
                          Created On
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Status</TableCell>
                      {/* <TableCell align="right">Actions</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkpoints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No checkpoints found
                        </TableCell>
                      </TableRow>
                    ) : (
                      checkpoints.map((checkpoint) => (
                        <TableRow key={checkpoint.id}>
                          <TableCell>
                            {/* {checkpoint.checkpoint ? (
                              checkpoint.checkpoint.length > 50 
                                ? `${checkpoint.checkpoint.substring(0, 50)}...` 
                                : checkpoint.checkpoint
                            ) : (
                              <em>No checkpoint</em>
                            )} */}
                            {checkpoint.checkpoint ? (
                              <Stack
                              direction="row"
                              spacing={3}
                              sx={{
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography 
                                component={Link} 
                                to={`/checkpoints/${checkpoint.id}/view`}
                                sx={{ 
                                  color: 'primary.main', 
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                  }
                                }}
                              >
                                {checkpoint.checkpoint}
                              </Typography>
                              <Stack
                              direction="row"
                              spacing={1}
                              sx={{margin: "auto"}}
                            >
                            <Chip 
                              label={checkpoint.head?.name} 
                              color={"primary"}
                              size="small" 
                            />
                            <Chip 
                              label={checkpoint.type?.name} 
                              color={"secondary"} 
                              size="small" 
                            />
                            <Chip 
                              label={checkpoint.department?.name} 
                              color={"default"} 
                              size="small" 
                            />
                            </Stack>
                            </Stack>
                            ) : (
                              <em>No checkpoint</em>
                            )}
                          </TableCell>
                          <TableCell>{checkpoint?.url ? <><a href={checkpoint?.url} target='_blank' >URL</a> {checkpoint?.page ? ` - Page #${checkpoint?.page}` : ''} </> : 'NA'}</TableCell>
                          {/* <TableCell>{checkpoint.head?.name}</TableCell>
                          <TableCell>{checkpoint.type?.name}</TableCell>
                          <TableCell>{checkpoint.department?.name}</TableCell> */}
                          <TableCell>  
                            {new Date(checkpoint.createdAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={checkpoint.isActive ? "Active" : "Inactive"} 
                              color={checkpoint.isActive ? "success" : "default"} 
                              size="small" 
                            />
                          </TableCell>
                          {/* <TableCell align="right">
                            <Button
                              component={Link}
                              to={`/checkpoints/${checkpoint.id}/edit`}
                              size="small"
                              startIcon={<EditIcon />}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteCheckpoint(checkpoint.id)}
                            >
                              Delete
                            </Button>
                          </TableCell> */}
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

export default CheckpointsPage;