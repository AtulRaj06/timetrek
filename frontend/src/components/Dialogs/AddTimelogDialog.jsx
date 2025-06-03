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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { timelogsAPI } from "../../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { calculateDuration } from "../../utils/dateTimeUtils";

const TASK_OPTIONS = [
  { label: "Analysis", value: "analysis" },
  { label: "Coding", value: "coding" },
  { label: "Testing", value: "testing" },
  { label: "Documentation", value: "documentation" },
  { label: "Meeting", value: "meeting" },
];

const AddTimelogDialog = ({
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
  fetchTimeLogs = () => {},
  userProjects,
}) => {
  const params = useParams();
  const { user } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleDialogClose = () => {
    setEditProjectId(null);
    setDialogOpen(false);
    fetchTimeLogs();
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

    // if (!formData.name.trim()) {
    //   setFormError("Head name is required");
    //   return;
    // }
    try {
      setSubmitLoading(true);
      // if (dialogMode === "add") {
      //   await projectsAPI.create(formData);
      // } else {
      //   await projectsAPI.update(editProjectId, formData);
      // }
      const newData = {
        status: "pending",
        projectId: params.projectId
          ? Number(params.projectId)
          : formData.projectId,
        userId: user.id,
        ...formData,
      };
      const timelog = await timelogsAPI.create(newData);

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
        {dialogMode === "add" ? "Add Timelog" : "Edit Timelog"}
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
            name="text"
            label="Enter Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.text}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Task</InputLabel>
            <Select
              name="task"
              value={formData.task}
              label="Task"
              onChange={handleChange}
              required
            >
              {TASK_OPTIONS.map((option) => (
                <MenuItem value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {userProjects && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                label="Project Id"
                onChange={handleChange}
                required
              >
                {userProjects.map((option) => (
                  <MenuItem value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <DatePicker
            required
            label="Date"
            name="date"
            value={formData.date ? dayjs(formData.date) : null}
            onChange={(val) =>
              handleChange({
                target: { name: "date", value: val, type: "date" },
              })
            }
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TimePicker
              required
              label="Start Time"
              name="start"
              maxTime={formData.end ? dayjs(formData.end) : null}
              value={
                formData.start ? dayjs(formData.start) : dayjs(formData.date)
              }
              onChange={(val) =>
                handleChange({
                  target: { name: "start", value: val, type: "date" },
                })
              }
            />
            <TimePicker
              required
              label="End Time"
              name="end"
              minTime={formData.start ? dayjs(formData.start) : null}
              value={formData.end ? dayjs(formData.end) : dayjs(formData.date)}
              onChange={(val) =>
                handleChange({
                  target: { name: "end", value: val, type: "date" },
                })
              }
            />
          </Box>
          Time Spent: {calculateDuration(formData.start, formData.end)}
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

export default AddTimelogDialog;
