import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { projectMembersAPI, projectsAPI } from "../../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AddProjectMemberDialog from "../../components/Dialogs/AddProjectMemberDialog";
import CommonDeleteDialog from "../../components/Dialogs/CommonDeleteDialog";

const ViewProjectPage = () => {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState({});
  const [projectMembersData, setProjectMembersData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    userEmail: "",
  });
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const params = useParams();
  const fetchProjectMembers = async () => {
    try {
      const [proRes, proMemRes] = await Promise.all([
        projectsAPI.getById(params.projectId),
        projectMembersAPI.getAllByProjectId(params.projectId),
      ]);
      setProjectData(proRes.data);
      setProjectMembersData(proMemRes.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjectMembers();
  }, []);

  const handleDelete = async () => {
    try {
      await projectMembersAPI.delete(deleteMemberId);
      fetchProjectMembers()
      setDialogDeleteOpen(false)
      setDeleteMemberId(null)
    } catch (err) {
      console.error('Error deleting Project member: ', err)
    }
  };

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
      renderCell: (params) => {
        console.log(params)
        return (
          <div>
            {showAdminBtn && (
              <Button
                variant="contained"
                color="secondary"
                disabled={params.row.roleInProject === 'owner'}
                onClick={() => {
                  setDeleteMemberId(params.row.id);
                  setDialogDeleteOpen(true);
                }}
                style={{ marginLeft: "10px" }}
              >
                Remove User
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
          onClick={() => setDialogOpen(true)}
        >
          Add Users
        </Button>
      )}
      <p>List of Users will be displayed.</p>
      <DataGrid rows={projectMembersData} columns={columns} />
      <AddProjectMemberDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        formError={formError}
        setFormError={setFormError}
        formData={formData}
        setFormData={setFormData}
        projectMembersData={projectMembersData}
        projectId={params.projectId}
        fetchProjectMembers={fetchProjectMembers}
      />
      <CommonDeleteDialog
        title="Remove Member"
        message="Are you sure you want to remove this Member from this project?"
        handleDelete={handleDelete}
        dialogOpen={dialogDeleteOpen}
        setDialogOpen={setDialogDeleteOpen}
        deleteBtntext = "Yes, Remove!"
      />
    </div>
  );
};
export default ViewProjectPage;
