import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddProjectDialog from "../../components/Dialogs/AddProjectDialog";
import { DataGrid } from "@mui/x-data-grid";
import { projectsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
  const { user } = useAuth();
  // State for dialog
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [editProjectId, setEditProjectId] = useState(null);

  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: null,
    startDate: null,
    endDate: null,
  });
  const [rows, setRows] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    // Fetch projects data from API
    fetchProjects();
  }, []);

  const showAdminBtn =
    user.role && (user.role === "super_admin" || user.role === "project_admin");

  // Handle dialog open for add
  const handleAddClick = () => {
    setDialogMode("add");
    setFormData({
      name: "",
      description: null,
      startDate: null,
      endDate: null,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Project name",
      width: 250,
    },
    {
      field: "description",
      headerName: "Description",
      width: 550,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "number",
      width: 110,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "number",
      width: 110,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 210,
      renderCell: (params) => {
        console.log("params.row.id", params.row.id);
        return (
          <div>
            {showAdminBtn && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setDialogMode("edit");
                  setFormData({
                    name: params.row.name,
                    description: params.row.description,
                    startDate: params.row.startDate,
                    endDate: params.row.endDate,
                  });
                  setEditProjectId(params.row.id);
                  setFormError("");
                  setDialogOpen(true);
                }}
              >
                Edit
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`${params.row.id}`)}
              style={{ marginLeft: "10px" }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Projects</h1>
      {showAdminBtn && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Projects
        </Button>
      )}
      <p>List of projects will be displayed here.</p>
      <DataGrid rows={rows} columns={columns} />
      {/* Add/Edit Project Dialog */}
      <AddProjectDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogMode={dialogMode}
        setDialogMode={setDialogMode}
        formError={formError}
        setFormError={setFormError}
        formData={formData}
        setFormData={setFormData}
        editProjectId={editProjectId}
        setEditProjectId={setEditProjectId}
        fetchProjects={fetchProjects}
      />
    </div>
  );
};
export default ProjectsPage;
