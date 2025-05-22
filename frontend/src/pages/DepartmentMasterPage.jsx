import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { departmentsAPI } from '../services/api';

const DepartmentMasterPage = () => {
  // State for departments data
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true
  });
  const [formError, setFormError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentsAPI.getAll();
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchDepartments();
  }, []);
  
  // Handle dialog open for add
  const handleAddClick = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      isActive: true
    });
    setFormError('');
    setDialogOpen(true);
  };
  
  // Handle dialog open for edit
  const handleEditClick = (department) => {
    setDialogMode('edit');
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      isActive: department.isActive
    });
    setFormError('');
    setDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormError('');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setFormError('Department name is required');
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      if (dialogMode === 'add') {
        await departmentsAPI.create(formData);
      } else {
        await departmentsAPI.update(currentDepartment.id, formData);
      }
      
      fetchDepartments();
      handleDialogClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError(err.response?.data?.message || 'An error occurred while saving the department');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Handle delete click
  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;
    
    try {
      setDeleteLoading(true);
      await departmentsAPI.delete(departmentToDelete.id);
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Failed to delete department. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    }
  };
  
  return (
    <Container maxWidth="100%">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Department Master
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Department
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No departments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell>{department.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={department.isActive ? "Active" : "Inactive"} 
                            color={department.isActive ? "success" : "default"} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditClick(department)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteClick(department)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
      
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add Department' : 'Edit Department'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Department Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submitLoading}
            >
              {submitLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the department "{departmentToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentMasterPage;