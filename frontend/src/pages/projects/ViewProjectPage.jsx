import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { projectMembersAPI, projectsAPI } from "../../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ViewProjectPage = () => {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState({});
  const [projectMembersData, setProjectMembersData] = useState([]);
  const params = useParams();
  const fetchProject = async () => {
    try {
      const [proRes, proMemRes] = await Promise.all([
        projectsAPI.getById(params.id),
        projectMembersAPI.getAllByProjectId(params.id),
      ]);
      setProjectData(proRes.data);
      setProjectMembersData(proMemRes.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const showAdminBtn =
    user.role && (user.role === "super_admin" || user.role === "project_admin");

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user.displayName",
      headerName: "User Name",
      width: 250,
      valueGetter: (_, data) => data.user.displayName,
    },
    {
      field: "roleInProject",
      headerName: "Role",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      width: 210,
      editable: true,
      renderCell: (params) => {
        console.log("params.row.id", params.row.id);
        return (
          <div>
            {showAdminBtn && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`${params.row.id}`)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Project: {projectData?.name}</h1>
      <div>
        <span>Description: </span>
        <span>{projectData.description}</span>
      </div>
      <div>
        <span>Start Date: </span>
        <span>
          {new Date(projectData.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      </div>
      <div>
        <span>End Date: </span>
        <span>
          {new Date(projectData.endDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      </div>
      {showAdminBtn && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          // onClick={handleAddClick}
        >
          Add Users
        </Button>
      )}
      <p>List of Users will be displayed.</p>
      <DataGrid rows={projectMembersData} columns={columns} />
    </div>
  );
};
export default ViewProjectPage;
