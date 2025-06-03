import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { projectMembersAPI, projectsAPI, usersAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUserProjectDialog = ({
  dialogOpen,
  setDialogOpen,
  formError,
  initialProjects,
  setFormError,
  // formData,
  // setFormData,
  // projectMembersData,
  // projectId,
  fetchUsers,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [allProjectOptions, setAllProjectOptions] = useState([]);
  const { user } = useAuth();
  const handleDialogClose = () => {
    setDialogOpen(false);
    fetchUsers();
  };
  const [inputSelectedProject, setInputSelectedProject] = useState(
    initialProjects?.projects
      // .filter((pro) => pro.roleInProject === "member")
      .map((pro) => pro.id)
  );

  useEffect(() => {
    setInputSelectedProject(
      initialProjects?.projects
        // .filter((pro) => pro.roleInProject === "member")
        .map((pro) => pro.id)
    );
  }, [initialProjects]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      response.data.map((res) => {
        return { label: res.name, value: res.id };
      });
      setAllProjectOptions(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    // Fetch projects data from API
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setInputSelectedProject((prev) => [...e.target.value]);
    setFormError("");
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialProjects.id) {
      setFormError("User Id is required");
      return;
    }

    // if (!formData.userEmail) {
    //   setFormError("User is required");
    //   return;
    // }

    try {
      setSubmitLoading(true);
      //   if (dialogMode === "add") {
      //     await projectsAPI.create(formData);
      //   } else {
      //     await projectsAPI.update(editProjectId, formData);
      //   }
      projectMembersAPI.updateUserProjects(
        initialProjects.id,
        inputSelectedProject
      );

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
      <DialogTitle>Add/Remove Projects</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Projects</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={inputSelectedProject}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => {
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {inputSelectedProject.map((value) => (
                      <Chip
                        key={value}
                        label={
                          allProjectOptions.find((op) => op.id === value).name
                        }
                      />
                    ))}
                  </Box>
                );
              }}
              MenuProps={MenuProps}
            >
              {allProjectOptions.map((op) => (
                <MenuItem key={op.name} value={op.id}>
                  {op.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default EditUserProjectDialog;
