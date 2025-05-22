import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import CheckpointViewPage from '../pages/CheckpointViewPage';
import { checkpointsAPI } from '../services/api';

// Mock the API
jest.mock('../services/api', () => ({
  checkpointsAPI: {
    getById: jest.fn()
  }
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Sample checkpoint data
const mockCheckpoint = {
  id: 1,
  checkpoint: 'Test Checkpoint',
  headId: 1,
  typeId: 1,
  departmentId: 1,
  url: 'https://example.com',
  page: 42,
  isActive: true,
  createdAt: '2023-01-01T12:00:00Z',
  updatedAt: '2023-01-02T12:00:00Z',
  head: { id: 1, name: 'Test Head' },
  type: { id: 1, name: 'Test Type' },
  department: { id: 1, name: 'Test Department' }
};

describe('CheckpointViewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuth = (user = null) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={['/checkpoints/1/view']}>
          <Routes>
            <Route path="/checkpoints/:id/view" element={<CheckpointViewPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('displays loading state initially', () => {
    checkpointsAPI.getById.mockResolvedValueOnce({ data: mockCheckpoint });
    renderWithAuth();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays checkpoint details after loading', async () => {
    checkpointsAPI.getById.mockResolvedValueOnce({ data: mockCheckpoint });
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Checkpoint')).toBeInTheDocument();
    expect(screen.getByText('Test Head')).toBeInTheDocument();
    expect(screen.getByText('Test Type')).toBeInTheDocument();
    expect(screen.getByText('Test Department')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('displays error message when checkpoint fetch fails', async () => {
    checkpointsAPI.getById.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Failed to load checkpoint details/i)).toBeInTheDocument();
  });

  test('displays edit button for super_admin users', async () => {
    checkpointsAPI.getById.mockResolvedValueOnce({ data: mockCheckpoint });
    renderWithAuth({ role: 'super_admin' });
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('does not display edit button for regular users', async () => {
    checkpointsAPI.getById.mockResolvedValueOnce({ data: mockCheckpoint });
    renderWithAuth({ role: 'user' });
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  test('navigates back to checkpoints list when back button is clicked', async () => {
    checkpointsAPI.getById.mockResolvedValueOnce({ data: mockCheckpoint });
    renderWithAuth();
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    
    const backButton = screen.getByText('Back to Checkpoints');
    backButton.click();
    
    expect(mockNavigate).toHaveBeenCalledWith('/checkpoints');
  });
});