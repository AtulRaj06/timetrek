import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  projectMembersAPI,
  projectsAPI,
  timelogsAPI,
} from "../../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AddProjectMemberDialog from "../../components/Dialogs/AddProjectMemberDialog";
import CommonDeleteDialog from "../../components/Dialogs/CommonDeleteDialog";
import { formatDate, formatTime } from "../../utils/dateTimeUtils";

const AdminPage = () => {
  const { user } = useAuth();
  const [logsData, setLogsData] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formError, setFormError] = useState("");
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const params = useParams();
  const fetchProjectLogs = async (selectedProjectId) => {
    try {
      const logs = await timelogsAPI.getAdminTimeLogsFromProjectId(
        selectedProjectId
      );
      setLogsData(logs.data);
    } catch (error) {
      console.error("Error fetching project logs:", error);
    }
  };

  const fetchAdminProjects = async () => {
    try {
      const response = await projectsAPI.getAllAdminProject();
      setAdminProjects(response.data);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
    }
  };

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const handleProjectSelect = (e) => {
    setSelectedProject(e.target.value);
    fetchProjectLogs(e.target.value);
  };

  const handleApprove = async (id) => {
    await timelogsAPI.update(id, { status: "approved" });
    fetchProjectLogs(selectedProject)

  };
  const handleReject = async (id) => {
    await timelogsAPI.update(id, { status: "rejected" });
    fetchProjectLogs(selectedProject)
  };

  const columns = [
    {
      field: "user.displayName",
      headerName: "User Name",
      width: 250,
      valueGetter: (_, data) => data.user.displayName,
    },
    {
      field: "text",
      headerName: "Description",
      width: 250,
    },
    {
      field: "task",
      headerName: "Task",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        let statusStyle = {};
        switch (params.value) {
          case "pending":
            statusStyle.fontColor = "#ffb200";
            break;
          case "approved":
            statusStyle.fontColor = "green";
            break;
          case "rejected":
            statusStyle.fontColor = "red";
            break;
          default:
            statusStyle.fontColor = "black";
        }
        return (
          <div style={{ color: statusStyle.fontColor }}>{params.value}</div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      renderCell: (params) => {
        return <div>{formatDate(params.row.start)}</div>;
      },
    },
    {
      field: "start",
      headerName: "Start Time",
      width: 100,
      renderCell: (params) => {
        console.log(params);
        return <div>{formatTime(params.value)}</div>;
      },
    },
    {
      field: "end",
      headerName: "End Time",
      width: 100,
      renderCell: (params) => {
        return <div>{formatTime(params.value)}</div>;
      },
    },
    {
      filed: "actions",
      headerName: "",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <Button type="button" onClick={()=>handleApprove(params.id)}>
              Approve
            </Button>
            <Button type="button" onClick={()=>handleReject(params.id)}>
              <span style={{ color: "red" }}>Reject</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Admin</h1>

      <FormControl style={{ width: "300px" }} margin="normal">
        <InputLabel>Select Project</InputLabel>
        <Select
          name="task"
          placeholder="Select Project"
          value={selectedProject}
          label="Task"
          onChange={handleProjectSelect}
          required
        >
          {adminProjects.map((option) => (
            <MenuItem value={option.id}>{option.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <p>List of All Admin Project Logs.</p>
      <DataGrid isRowSelectable={false} rows={logsData} columns={columns} />
    </div>
  );
};
export default AdminPage;
