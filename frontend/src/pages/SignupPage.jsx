import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../assets/images/logo.png";
import { usersAPI } from "../services/api";

const SignupPage = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    role: "",
  });
  console.log("formData", formData);

  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.displayName || !formData.email) {
        setError("Name and email are required");
        setLoading(false);
        return;
      }

      // If creating a new user, password is required
      if (!formData.password) {
        setError("Password is required for new users");
        setLoading(false);
        return;
      }

      // Create new user
      await usersAPI.create(formData);
      setMessage("Account created successfully");
    } catch (error) {
      console.error("Error saving user:", error);
      setError(
        error.response?.data?.message ||
          "Failed to save user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError("")
    setMessage("");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            padding: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <img
              src={logoImage}
              alt="Wonder Finance Logo"
              style={{
                maxWidth: "220px",
                height: "auto",
              }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Create new account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 3,
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}

          {message && (
            <Alert
              severity="success"
              sx={{
                width: "100%",
                mb: 3,
                borderRadius: 1,
              }}
            >
              {message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="project_admin">Project Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                fullWidth
                label={"Password"}
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Box
              sx={{
                textAlign: "center",
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
