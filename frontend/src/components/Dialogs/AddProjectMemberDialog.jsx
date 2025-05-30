import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { projectMembersAPI, usersAPI } from "../../services/api";

const AddProjectMemberDialog = ({
  dialogOpen,
  setDialogOpen,
  formError,
  setFormError,
  formData,
  setFormData,
  projectMembersData,
  projectId,
  fetchProjectMembers,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [emailOptions, setEmailOptions] = useState([]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    fetchProjectMembers();
  };

  const fetchUserOptions = useCallback(async () => {
    const projectMembersEmails = projectMembersData.map(
      (data) => data.user.email
    );
    const users = await usersAPI.getAll();
    const options = users.data.filter(
      (user) => !projectMembersEmails.includes(user.email)
    );
    setEmailOptions(options);
  }, [projectMembersData]);

  useEffect(() => {
    fetchUserOptions();
  }, [fetchUserOptions]);
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      setFormError("Project Id is required");
      return;
    }

    if (!formData.userEmail) {
      setFormError("User is required");
      return;
    }

    try {
      setSubmitLoading(true);
      //   if (dialogMode === "add") {
      //     await projectsAPI.create(formData);
      //   } else {
      //     await projectsAPI.update(editProjectId, formData);
      //   }
      projectMembersAPI.create({
        userId: formData.userEmail,
        projectId: projectId,
        roleInProject: "member",
      });

      handleDialogClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      setFormError(
        err.response?.data?.message || "An error occurred while saving the head"
      );
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>User Email</InputLabel>
            <Select
              name="userEmail"
              value={formData.userEmail}
              label="User Email"
              onChange={handleChange}
              required
            >
              {emailOptions.map((option) => (
                <MenuItem
                  value={option.id}
                >{`${option.displayName} (${option.email})`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
              required
            >
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="member">Project Member</MenuItem>
            </Select>
          </FormControl> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProjectMemberDialog;
