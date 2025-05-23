import { useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { projectsAPI } from "../../services/api";

const AddProjectDialog = ({
  dialogOpen,
  setDialogOpen,
  dialogMode,
  setDialogMode,
  formError,
  setFormError,
  formData,
  setFormData,
  editProjectId,
  setEditProjectId,
  fetchProjects,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleDialogClose = () => {
    setEditProjectId(null);
    setDialogOpen(false);
    fetchProjects();
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "text" ? value : value.valueOf(),
    }));
    setFormError("");
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Head name is required");
      return;
    }

    try {
      setSubmitLoading(true);
      if (dialogMode === "add") {
        await projectsAPI.create(formData);
      } else {
        await projectsAPI.update(editProjectId, formData);
      }

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
      <DialogTitle>
        {dialogMode === "add" ? "Add Project" : "Edit Project"}
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
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <DatePicker
              required
              label="Start Date"
              name="startDate"
              maxDate={formData.endDate ? dayjs(formData.endDate) : null}
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(val) =>
                handleChange({
                  target: { name: "startDate", value: val, type: "date" },
                })
              }
            />
            <DatePicker
              required
              label="End Date"
              name="endDate"
              minDate={formData.startDate ? dayjs(formData.startDate) : null}
              value={formData.endDate ? dayjs(formData.endDate) : null}
              onChange={(val) =>
                handleChange({
                  target: { name: "endDate", value: val, type: "date" },
                })
              }
            />
          </Box>
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

export default AddProjectDialog;
