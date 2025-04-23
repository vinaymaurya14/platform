import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Dialog, TextField } from "@mui/material";
import "./CreateExp.css";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import CibiSmallIcon from "../../../assets/icons/cibismall.svg?react";
export default function CreateExp({ onChildClick, projectId, CreateExperiment}) {
  const [ExpName, setExpName] = useState("");
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [openModel, setOpenModel] = useState(true);
  const [ExperimentBox, seExperimentBox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const onExpNameChange = (e) => {
    if (e.target.value) {
      setDisableCreateButton(false);
    } else {
      setDisableCreateButton(true);
    }
    setExpName(e.target.value);
  };

  const CreateProject = () => {
    console.log(ExpName);
    if (!ExpName) {
      return;
    }

    CreateExperiment(projectId, ExpName)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setOpenModel(false);
          onChildClick(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Dialog open={openModel} sx={{}}>
        <div style={{ borderRadius: "12px", padding: "30px",width: "420px" }}>

        <Box
            sx={{ gap: "20px", position:"absolute",top:"12px", right:"12px", textAlign: "right", m: 1, cursor: "pointer", }}
            onClick={() => {
              setOpenModel(false);
              onChildClick(false);
            }}
          >
            <CrossIcon/>
          </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "20px",
            gap: "20px"
          }}
        >
          <Box
            sx={{
              // borderBottom: "1px solid #d5d5d6",
              color: "rgba(0, 0, 0, 0.87)",
              padding: "5px",
              textAlign: "center",
              borderRadius: "10px",
              gap:"16px"
            }}
          >
            <Box sx={{
                width: "62px",
                height: "62px", margin: "0 auto", display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#EEEEF8",
                borderRadius: "50px",
                marginBottom: "11px"
              }}>
                <CibiSmallIcon style={{width:"40px", height:"40px"}}/>
              </Box>
            <Typography className="CreateProject">
              Create Experiment
            </Typography>
          </Box>
          <Box
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              color: "rgba(0,0,0,.87)",
              display: "flex",
              flexDirection: "column",
              gap:"10px"
            }}
          >
            <label className="FormLabels">Experiment Name*</label>
            <TextField
              fullWidth
              sx={{ 
                // mt: 1,
                // mb: 1,
                fontSize:"14px",
                textAlign: "left",
                background: "#fff",
                '& fieldset': { borderColor: "#D3D3EA" },
                '& .MuiInputBase-root':{height:"44px"},
                "& .MuiOutlinedInput-root":{
                 "&.Mui-focused fieldset" :{
                    "borderColor": "#5420E8"
                  }
                }
              }}
              placeholder="Enter Experiment Name"
              value={ExpName}
              onChange={onExpNameChange}
              className="Text_creExp"
            />
          </Box>

          <Box sx={{ textAlign: "end" }}>
          <button style={{
                width:"100%",display: "flex",
                gap: "10px",
                color: "white",
                justifyContent: "center"
                }} disabled={disableCreateButton} className="gradient-background" onClick={CreateProject} ><CibiSmallIcon style={{height:"24px", width:"24px"}}/>Create</button>
          </Box>
        </Box>
        </div>
      </Dialog>
                
    
    </>
  );
}
