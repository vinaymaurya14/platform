import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, Typography, Dialog, TextField, Checkbox } from "@mui/material";
import cibilogo from "../../../assets/LoginImages/cibiLogo.png";
import "./CreateProject.css";
import Buttons from "../../Elements/Buttons";
import { useNavigate } from "react-router-dom";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
import TickSquare from "../../../assets/icons/ticksquare.svg?react";
import TickSquareChecked from "../../../assets/icons/ticksquarechecked.svg?react";
// import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
import Alert from "@mui/material/Alert";
export default function CreateProject({
  onChildClick,
  CreateNewProject,
  CreateExperiment,
  onSuccess = () => {},
}) {
  const [projectData, setProjectData] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [openModel, setOpenModel] = useState(true);
  const [ExperimentBox, seExperimentBox] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [ExperimentName, setExperimentName] = useState();
  const [errorMesg, seterrorMesg] = useState("");
  const navigate = useNavigate();
  const onProjectChange = (e) => {
    if (e.target.value && description) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setProjectName(e.target.value);
  };
  const onDescriptionChange = (e) => {
    if (e.target.value && projectName) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setDescription(e.target.value);
  };

  const onExpNameChange = (e) => {
    setExperimentName(e.target.value);
  };
  console.log(ExperimentName);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
    if (isChecked) {
      seExperimentBox(true);
    } else {
      seExperimentBox(false);
    }
  };

  const onCreateProject = () => {
    console.log(projectName, description);
    if (!projectName && !description) {
      seterrorMesg('Project & Experiment name is required')
      return;
    }
    if (isChecked) {
      if (!ExperimentName) {
        seterrorMesg('Experiment name is required')
        return;
      }
    }
    console.log(projectName, description);
    CreateNewProject(projectName, description)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (isChecked) {
            CreateExperiment(res.data.proj_id, ExperimentName)
              .then((creExpres) => {
                console.log(creExpres);
                if (creExpres.status === 200) {
                  setOpenModel(false);
                  onChildClick(false);
                  debugger;
                  onSuccess();
                  navigate(`${res.data.proj_id}`);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setOpenModel(false);
            onChildClick(false);
            navigate(`${res.data.proj_id}`);
            onSuccess();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Dialog open={openModel}>
        <div style={{ borderRadius: "12px", padding: "30px", width: "25vw" }}>
          <Box
            sx={{
              position: "absolute",
              top: "12px",
              right: "12px",
              textAlign: "right",
              m: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenModel(false);
              onChildClick(false);
            }}
          >
            <CrossIcon />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // background: "#fff",
              // borderRadius: "20px",
            }}
          >
            <Box
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                padding: "5px",
                textAlign: "center",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  width: "62px",
                  height: "62px",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#EEEEF8",
                  borderRadius: "50px",
                  marginBottom: "11px",
                }}
              >
                <CibiSmallIcon style={{ width: "40px", height: "40px" }} />
              </Box>
              <Typography className="CreateProject">
                <b>Create New Project</b>
              </Typography>
            </Box>
            <Box
              sx={{
                // p: 2,
                fontSize: "18px",
                fontWeight: 500,
                color: "rgba(0,0,0,.87)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div>
                <label className="FormLabels">Project Name*</label>
                <TextField
                  fullWidth
                  sx={{
                    // mt: 1,
                    // mb: 1,
                    fontSize: "14px",
                    textAlign: "left",
                    background: "#fff",
                    "& fieldset": { borderColor: "#D3D3EA" },
                    "& .MuiInputBase-root": {
                      height: "44px",
                      fontSize: "14px",
                    },
                  }}
                  placeholder="Enter Project Name"
                  value={projectName}
                  onChange={onProjectChange}
                  className="Text_creExp"
                />
              </div>
              <div>
                <label className="FormLabels">Problem Statement*</label>
                <TextField
                  fullWidth
                  sx={{
                    fontSize: "14px",
                    textAlign: "left",
                    background: "#fff",
                    "& fieldset": { borderColor: "#D3D3EA" },
                    "& .MuiInputBase-root": {
                      fontSize: "14px",
                    },
                  }}
                  placeholder="Enter Problem Statement"
                  value={description}
                  rows={3}
                  multiline
                  onChange={onDescriptionChange}
                  className="Text_creExp"
                />
              </div>
            </Box>

            <Box
              sx={{
                // pl: 2,
                pt: 0.5,
                fontSize: "18px",
                fontWeight: 500,
                color: "rgba(0,0,0,.87)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "10px",
                }}
              >
                <Checkbox
                  type="checkbox"
                  className="CheckBox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  checkedIcon={
                    <TickSquareChecked
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "#5420E8",
                        padding: 0,
                      }}
                    />
                  }
                  icon={
                    <TickSquare style={{ width: "24px", height: "24px" }} />
                  }
                />
                <label className="FormLabels AddExp">
                  {"  "}Add Experiment Instantly...
                </label>
              </div>
              <Box className={isChecked ? "" : "create-disable-field"}>
                <Box
                  sx={{
                    // p: 1,
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "rgba(0,0,0,.87)",
                  }}
                >
                  <label className="FormLabels">Experiment Name*</label>
                  <TextField
                    fullWidth
                    sx={{
                      fontSize: "14px",
                      mt: 1,
                      mb: 1,
                      textAlign: "left",
                      background: "#fff",
                      "& fieldset": { borderColor: "#D3D3EA" },
                      "& .MuiInputBase-root": {
                        height: "44px",
                        fontSize: "14px",
                      },
                    }}
                    placeholder="Enter Experiment Name"
                    value={ExperimentName}
                    onChange={onExpNameChange}
                    className="Text_creExp"
                  />
                </Box>
              </Box>
            </Box>
            {errorMesg && (
              <center>
                <span style={{ color: "red" }}>
                  <Alert severity="error">{errorMesg}</Alert>
                </span>
              </center>
            )}
            <Box sx={{ padding: "16px 0px", textAlign: "end" }}>
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  color: "white",
                  justifyContent: "center",
                }}
                className="gradient-background"
                onClick={onCreateProject}
              >
                <CibiSmallIcon style={{ height: "24px", width: "24px" }} />
                Create Project
              </button>
            </Box>
          </Box>
        </div>
      </Dialog>
    </>
  );
}
