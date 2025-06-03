import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { projectsAPI, timelogsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  calculateDuration,
  formatDate,
  formatDateTime,
  formatTime,
} from "../../utils/dateTimeUtils";

const AdminPage = () => {
  const [logsData, setLogsData] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useAuth();
  const fetchProjectLogs = async (selectedProjectId) => {
    try {
      const logs = await timelogsAPI.getAdminTimeLogsFromProjectId(
        !!selectedProjectId[0]
          ? selectedProjectId.join(",")
          : adminProjects.map((p) => p.id).join(",")
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
      fetchProjectLogs(response.data.map((p) => p.id));
    } catch (error) {
      console.error("Error fetching admin projects:", error);
    }
  };

  useEffect(() => {
    fetchAdminProjects();
  }, []);

  const handleProjectSelect = (e) => {
    setSelectedProject(e.target.value);
    fetchProjectLogs([e.target.value]);
  };

  const handleApprove = async (id) => {
    await timelogsAPI.update(id, { status: "approved" });
    fetchProjectLogs([selectedProject]);
  };
  const handleReject = async (id) => {
    await timelogsAPI.update(id, { status: "rejected" });
    fetchProjectLogs([selectedProject]);
  };

  const columns = [
    {
      field: "user.displayName",
      headerName: "User Name",
      width: 200,
      valueGetter: (_, data) => data.user.displayName,
    },
    {
      field: "project.name",
      headerName: "Project Name",
      width: 200,
      valueGetter: (_, data) => data.project.name,
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
      field: "timeSpent",
      headerName: "Time Spent",
      width: 100,
      renderCell: (params) => {
        return <div>{calculateDuration(params.row.start, params.row.end)}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => {
        return <div>{formatDateTime(params.value)}</div>;
      },
    },
    {
      filed: "actions",
      headerName: "",
      width: 200,
      renderCell: (params) => {
        const actionsDisabled = user.id === params.id;
        return (
          <div>
            <Button
              type="button"
              disabled={actionsDisabled}
              onClick={() => handleApprove(params.id)}
            >
              Approve
            </Button>
            <Button
              type="button"
              disabled={actionsDisabled}
              onClick={() => handleReject(params.id)}
            >
              <span style={{ color: actionsDisabled ? "gray" : "red" }}>
                Reject
              </span>
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
          {[{ id: null, name: "All" }, ...adminProjects].map((option) => (
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
