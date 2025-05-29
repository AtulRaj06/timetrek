import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
  getCurrentUser: () => api.get("/auth/me"),
};

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post("/users", userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post("/projects", projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  // delete: (id) => api.delete(`/projects/${id}`)
};

// Projects Member API
export const projectMembersAPI = {
  // getAll: () => api.get("/project_members"),
  getAllByProjectId: (id) => api.get(`/project_members/${id}`),
  create: (projectData) => api.post("/project_members", projectData),
  // update: (id, projectData) => api.put(`/project_members/${id}`, projectData),
  delete: (id) => api.delete(`/project_members/${id}`),
};

// Timelogs API
export const timelogsAPI = {
  // getAll: (params) => api.get('/timelogs', { params }),
  getMyTimelogs: () => api.get(`/timelogs/my`),
  getMyTimelogsFromProjectId: (projectId) =>
    api.get(`/timelogs/my/project/${projectId}`),
  create: (timelogData) => api.post("/timelogs", timelogData),
  // update: (id, checkpointData) => api.put(`/timelogs/${id}`, checkpointData),
  // delete: (id) => api.delete(`/timelogs/${id}`)
};

// // Activity Logs API
// export const activityLogsAPI = {
//   getAll: (params) => api.get('/activity-logs', { params })
// };

export default api;
