import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    login: jest.fn().mockImplementation((email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve();
      } else {
        return Promise.reject({ response: { data: { message: 'Invalid credentials' } } });
      }
    })
  })
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock the logo image
jest.mock('../assets/images/logo.png', () => 'mocked-logo.svg');

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  test('renders the login form with logo and all required elements', () => {
    renderLoginPage();
    
    // Check if logo is rendered
    const logoElement = screen.getByAltText('Wonder Finance Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.src).toContain('mocked-logo.svg');
    
    // Check if heading is rendered
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    renderLoginPage();
    
    // Fill in the form with incorrect credentials
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('toggles password visibility when the visibility icon is clicked', () => {
    renderLoginPage();
    
    // Get the password input and toggle button
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    
    // Password should be hidden initially
    expect(passwordInput.type).toBe('password');
    
    // Click the toggle button
    fireEvent.click(toggleButton);
    
    // Password should be visible now
    expect(passwordInput.type).toBe('text');
    
    // Click the toggle button again
    fireEvent.click(toggleButton);
    
    // Password should be hidden again
    expect(passwordInput.type).toBe('password');
  });

  test('submits the form with correct credentials', async () => {
    renderLoginPage();
    
    // Fill in the form with correct credentials
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // No error message should appear
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });
});