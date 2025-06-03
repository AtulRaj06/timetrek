import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTimelogDialog from "../../components/Dialogs/AddTimelogDialog";
import { DataGrid } from "@mui/x-data-grid";
import { projectsAPI, timelogsAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  calculateDuration,
  formatDate,
  formatTime,
} from "../../utils/dateTimeUtils";

const TimelogsPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const showAdminBtn =
    user.role && (user.role === "super_admin" || user.role === "project_admin");

  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [editProjectId, setEditProjectId] = useState(null);

  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    text: "",
    task: null,
    start: null,
    end: null,
    date: null,
  });

  const fetchTimeLogs = async () => {
    try {
      const response = await timelogsAPI.getMyTimelogsFromProjectId(
        params.projectId
      );
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    // Fetch projects data from API
    fetchTimeLogs();
  }, []);

  // Handle dialog open for add
  const handleAddClick = () => {
    setDialogMode("add");
    setFormData({
      text: "",
      task: null,
      start: null,
      end: null,
      date: null,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const columns = [
    {
      field: "text",
      headerName: "Description",
      width: 250,
    },
    {
      field: "task",
      headerName: "Task",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
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
      width: 250,
      renderCell: (params) => {
        return <div>{formatDate(params.row.start)}</div>;
      },
    },
    {
      field: "start",
      headerName: "Start Time",
      width: 250,
      renderCell: (params) => {
        return <div>{formatTime(params.value)}</div>;
      },
    },
    {
      field: "end",
      headerName: "End Time",
      width: 250,
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
  ];

  const showAddTimelogBtn = user.role && user.role !== "super_admin";

  return (
    <div>
      <h1>Timelogs</h1>
      {showAddTimelogBtn && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Timelogs
        </Button>
      )}
      <p>List of Your timelogs will be displayed here.</p>
      <DataGrid rows={rows} columns={columns} />
      {/* Add/Edit Project Dialog */}
      <AddTimelogDialog
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
        fetchTimeLogs={fetchTimeLogs}
      />
    </div>
  );
};

export default TimelogsPage;
