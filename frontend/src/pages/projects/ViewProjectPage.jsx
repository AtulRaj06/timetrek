import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { projectsAPI } from "../../services/api";
import { useParams } from "react-router-dom";

const ViewProjectPage = () => {
  const [projectData, setProjectData] = useState({});
  const params = useParams();
  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(params.id);
      setProjectData(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  console.log("projectData", projectData);
  return (
    <div>
      <h1>Project: {projectData?.name}</h1>
      <div>
        <span>Description: </span>
        <span>
          {projectData.description}
        </span>
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
      {/* {showAdminBtn && ( */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        // onClick={handleAddClick}
      >
        Add Users
      </Button>
      {/* )} */}
      <p>List of Users will be displayed.</p>
      <DataGrid rows={[]} columns={[]} />
    </div>
  );
};
export default ViewProjectPage;
