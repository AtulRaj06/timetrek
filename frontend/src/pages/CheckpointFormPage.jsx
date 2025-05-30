import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { checkpointsAPI, departmentsAPI, typesAPI, headsAPI } from '../services/api';

const CheckpointFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    headId: '',
    typeId: '',
    departmentId: '',
    // fiscalYear: '',
    checkpoint: '',
    url: '',
    page: '',
    isActive: true
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Master data
  const [departments, setDepartments] = useState([]);
  const [types, setTypes] = useState([]);
  const [heads, setHeads] = useState([]);
  
  // Fetch master data
  const fetchMasterData = async () => {
    try {
      const [departmentsResponse, typesResponse, headsResponse] = await Promise.all([
        departmentsAPI.getAll(),
        typesAPI.getAll(),
        headsAPI.getAll()
      ]);
      
      setDepartments(departmentsResponse.data);
      setTypes(typesResponse.data);
      setHeads(headsResponse.data);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };
  
  // Fetch checkpoint data if in edit mode
  const fetchCheckpointData = async () => {
    if (!isEditMode) return;
    
    try {
      setLoading(true);
      const response = await checkpointsAPI.getById(id);
      const checkpoint = response.data;
      
      setFormData({
        headId: checkpoint.headId,
        typeId: checkpoint.typeId,
        departmentId: checkpoint.departmentId,
        // fiscalYear: checkpoint.fiscalYear,
        checkpoint: checkpoint.checkpoint || '',
        url: checkpoint.url || '',
        page: checkpoint.page || '',
        isActive: checkpoint.isActive
      });
    } catch (err) {
      console.error('Error fetching checkpoint:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchMasterData();
    fetchCheckpointData();
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.headId) {
      newErrors.headId = 'Head is required';
    }
    
    if (!formData.typeId) {
      newErrors.typeId = 'Type is required';
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    // if (!formData.fiscalYear) {
    //   newErrors.fiscalYear = 'Fiscal Year is required';
    // }
    
    if (formData.page && (isNaN(formData.page) || formData.page < 0)) {
      newErrors.page = 'Page must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      // Convert page to number if it's not empty
      const submitData = {
        ...formData,
        page: formData.page ? Number(formData.page) : null
      };
      
      if (isEditMode) {
        await checkpointsAPI.update(id, submitData);
      } else {
        await checkpointsAPI.create(submitData);
      }
      
      setSubmitSuccess(true);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/checkpoints');
      }, 1500);
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError(err.response?.data?.message || 'An error occurred while saving the checkpoint');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  return (
    <Container maxWidth="100%">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit Checkpoint' : 'Create New Checkpoint'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/checkpoints')}
          >
            Back to Checkpoints
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: 3 }}>
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Checkpoint {isEditMode ? 'updated' : 'created'} successfully!
              </Alert>
            )}
            
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Checkpoint"
                    name="checkpoint"
                    value={formData.checkpoint}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={Boolean(errors.headId)}>
                    <InputLabel id="head-label">Head *</InputLabel>
                    <Select
                      labelId="head-label"
                      name="headId"
                      value={formData.headId}
                      onChange={handleChange}
                      label="Head *"
                      required
                    >
                      {heads.map(head => (
                        <MenuItem key={head.id} value={head.id}>
                          {head.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.headId && <FormHelperText>{errors.headId}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={Boolean(errors.typeId)}>
                    <InputLabel id="type-label">Type *</InputLabel>
                    <Select
                      labelId="type-label"
                      name="typeId"
                      value={formData.typeId}
                      onChange={handleChange}
                      label="Type *"
                      required
                    >
                      {types.map(type => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.typeId && <FormHelperText>{errors.typeId}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={Boolean(errors.departmentId)}>
                    <InputLabel id="department-label">Department *</InputLabel>
                    <Select
                      labelId="department-label"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      label="Department *"
                      required
                    >
                      {departments.map(dept => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.departmentId && <FormHelperText>{errors.departmentId}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Fiscal Year"
                    name="fiscalYear"
                    value={formData.fiscalYear}
                    onChange={handleChange}
                    error={Boolean(errors.fiscalYear)}
                    helperText={errors.fiscalYear}
                    required
                  />
                </Grid> */}
                
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="URL"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Page"
                    name="page"
                    type="number"
                    value={formData.page}
                    onChange={handleChange}
                    error={Boolean(errors.page)}
                    helperText={errors.page}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
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
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/checkpoints')}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default CheckpointFormPage;