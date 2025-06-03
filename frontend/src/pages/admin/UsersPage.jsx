import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { projectsAPI, timelogsAPI, usersAPI } from "../../services/api";
import { useParams } from "react-router-dom";
import { formatDate, formatTime } from "../../utils/dateTimeUtils";
import EditUserProjectDialog from "../../components/Dialogs/EditUserProjectDialog";

const UsersPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [adminProjects, setAdminProjects] = useState([]);
  const [initialProjects, setInitialProjects] = useState({ id: null, projects: [] });
  const [formError, setFormError] = useState(null)

  const params = useParams();

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAllWithProjects(null);
      setUsersData(response.data);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActive = async (e, id) => {
    await usersAPI.update(id, { isDeleted: !e.target.checked });
    fetchUsers();
  };

  const handleOpenEditProject = (userId, projects) => {
    setInitialProjects({ id: userId, projects: projects });
    setDialogOpen(true);
  };

  const columns = [
    {
      field: "displayName",
      headerName: "User Name",
      width: 250,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
    },
    {
      field: "projects",
      headerName: "Projects",
      width: 150,
      valueGetter: (_, data) =>
        `${
          data.role === "super_admin"
            ? `all${data.projectMembers.length > 0 ? "," : ""} `
            : ""
        }${data.projectMembers.map((proMem) => proMem.project.name)}`,
    },
    {
      field: "active",
      headerName: "User Active",
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            checked={!params.row.isDeleted}
            onClick={(e) => handleActive(e, params.id)}
          />
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <Button
              type="button"
              onClick={() =>
                handleOpenEditProject(
                  params.id,
                  params.row.projectMembers.map((proMem) => proMem.project)
                )
              }
            >
              Edit Project
            </Button>
            {/* <Button type="button" onClick={() => handleReject(params.id)}>
              <span style={{ color: "red" }}>Reject</span>
            </Button> */}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Users Management</h1>

      <p>List of All Registered Users.</p>
      <DataGrid isRowSelectable={false} rows={usersData} columns={columns} />

      {/* Add/Remove User Project Dialog */}
      <EditUserProjectDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        initialProjects={initialProjects}
        formError={formError}
        setFormError={setFormError}
        // formData={formData}
        // setFormData={setFormData}
        // editProjectId={editProjectId}
        // setEditProjectId={setEditProjectId}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};
export default UsersPage;
