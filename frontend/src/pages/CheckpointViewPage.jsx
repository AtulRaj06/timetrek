import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { checkpointsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CheckpointViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  
  // State for checkpoint data and loading
  const [checkpoint, setCheckpoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch checkpoint data
  const fetchCheckpointData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await checkpointsAPI.getById(id);
      setCheckpoint(response.data);
    } catch (err) {
      console.error('Error fetching checkpoint:', err);
      setError(err.response?.status === 404 
        ? 'Checkpoint not found' 
        : 'Failed to load checkpoint details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchCheckpointData();
  }, [id]);
  
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
  
  return (
    <Container maxWidth="100%">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Checkpoint Details
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
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="error">{error}</Alert>
            <Button 
              sx={{ mt: 2 }} 
              variant="outlined" 
              onClick={() => navigate('/checkpoints')}
            >
              Return to Checkpoint List
            </Button>
          </Box>
        ) : checkpoint ? (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Checkpoint Name/Description */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  {checkpoint.checkpoint || 'No checkpoint name'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 2 }}>
                  <Chip 
                    label={checkpoint.isActive ? "Active" : "Inactive"} 
                    color={checkpoint.isActive ? "success" : "default"} 
                    size="small" 
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              {/* Master Data Information */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Head</Typography>
                <Typography variant="body1" gutterBottom>
                  {checkpoint.head?.name || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Type</Typography>
                <Typography variant="body1" gutterBottom>
                  {checkpoint.type?.name || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Department</Typography>
                <Typography variant="body1" gutterBottom>
                  {checkpoint.department?.name || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              {/* URL and Page Number */}
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight="bold">URL</Typography>
                <Typography variant="body1" gutterBottom>
                  {checkpoint.url ? (
                    <a href={checkpoint.url} target="_blank" rel="noopener noreferrer">
                      {checkpoint.url}
                    </a>
                  ) : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold">Page Number</Typography>
                <Typography variant="body1" gutterBottom>
                  {checkpoint.page || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              {/* Timestamps */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Created At</Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(checkpoint.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Last Updated</Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(checkpoint.updatedAt)}
                </Typography>
              </Grid>
              
              {/* Action Buttons */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/checkpoints')}
                    sx={{ mr: 2 }}
                  >
                    Back to List
                  </Button>
                  
                  {/* Only show Edit button for super_admin users */}
                  {user?.role === 'super_admin' && (
                    <Button
                      component={Link}
                      to={`/checkpoints/${checkpoint.id}/edit`}
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ) : null}
      </Box>
    </Container>
  );
};

export default CheckpointViewPage;