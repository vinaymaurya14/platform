import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CreateExperiment,
  CreateNewProject,
  gettabularProjects,
} from "./../../services/Portals/MLopsPortals";
import "./Tabular.css";

import { StyledEngineProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { ControlPoint } from "@mui/icons-material";
import CreateProject from "../common/CreateProject/CreateProject";
import ListProjects from "../common/ListProjects/ListProjects";
export default function Tabular() {
  const [projectsList, setProjectsList] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);
  const navigate = useNavigate();
  const getProjects = (showExp, ProjData) => {
    gettabularProjects()
      .then((res) => {
        if (res.status === 200) {
          setProjectsList(res.data);
          if (showExp) {
            localStorage.setItem("projectId", ProjData.proj_id);
            navigate(`/${ProjData.proj_name}/${ProjData.proj_id}`);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChildClick = (childStateValue) => {
    setShowDialogBox(childStateValue);
    getProjects();
  };
  const viewProject = (e, proj_id) => {
    e.preventDefault();
    // navigate to project page
    navigate(`/tabular/${proj_id}`);
  };
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <div style={{ width: "-webkit-fill-available", padding: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="page-title">MLOps</div>
          <div className="page-action">
            <Button
              className="page-action-btn"
              onClick={() => setShowDialogBox(true)}
            >
              <ControlPoint />
              <span>New Project</span>
            </Button>
            {ShowDialogBox ? (
              <CreateProject
                onChildClick={handleChildClick}
                CreateExperiment={CreateExperiment}
                CreateNewProject={CreateNewProject}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <ListProjects
          projectsList={projectsList}
          onClickProject={viewProject}
        />
      </div>
    </StyledEngineProvider>
  );
}
