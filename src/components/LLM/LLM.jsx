import { ControlPoint } from "@mui/icons-material";
import { Box, Button, StyledEngineProvider, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateExperiment,
  CreateNewLLMProject,
  getLLMProjectsList,
} from "../../services/Portals/LLMPortals";
import CreateProject from "../common/CreateProject/CreateProject";
import ListProjects from "../common/ListProjects/ListProjects";
import TabPanel from "../Elements/TabPanel";
import styles from "./LLM.module.css";
import { ModelCatalouge } from "./Project/ModelCatalouge/ModelCatalouge";
import PlayGroundTab from "./Project/PlayGround/PlayGroundTab";
export default function LLM() {
  const [projectsList, setProjectsList] = useState([]);
  const [ShowDialogBox, setShowDialogBox] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const getProjects = () => {
    getLLMProjectsList()
      .then((res) => {
        if (res.status === 200) {
          const filteredProjects = res.data.filter(
            (project) => project.proj_type === "llm"
          );
          setProjectsList(filteredProjects);
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
    navigate(`/llm/${proj_id}`);
  };
  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <div style={{ width: "-webkit-fill-available", padding: "24px" }}>
        <Box
          className={styles["header-tabs-ctn"]}
          sx={{ borderBottom: 1, borderColor: "#D3D3EA", marginBottom: "20px" }}
        >
          <Tabs
            value={tabValue}
            onChange={tabChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#5420E8",
                color: "#5420E8",
              },
            }}
            sx={{
              height: "32px",
              "&.MuiTabs-root": {
                height: "32px",
                minHeight: "32px",
              },
              ".MuiTabs-flexContainer": {
                gap: "44px",
                color: "#8D8DAC",
              },
              ".MuiButtonBase-root": {
                fontWeight: 600,
                fontSize: "18px",
                fontFamily: "Plus Jakarta Sans",
                textTransform: "none",
                padding: "0px 0px 9px 0px",
                minWidth: "130px",
                minHeight: "32px",
                "&.Mui-selected": {
                  color: "#5420E8",
                  fontWeight: 700,
                },
              },
            }}
            textColor="inherit"
          >
            <Tab sx={{ alignItems: "flex-start" }} label="All Projects" />
            <Tab sx={{ alignItems: "flex-start" }} label="Playground" />
            <Tab sx={{ alignItems: "flex-start" }} label="Model Catalouge" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="page-title"></div>
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
                  CreateNewProject={CreateNewLLMProject}
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
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {/* <PlayGround /> */}
          <PlayGroundTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ModelCatalouge />
        </TabPanel>
      </div>
    </StyledEngineProvider>
  );
}
