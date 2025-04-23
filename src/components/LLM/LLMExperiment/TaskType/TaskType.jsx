import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/styled-engine";
import Button from "@mui/material/Button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BackIcon from "../../../../assets/icons/back.svg?react";
import SettingsIcon from "../../../../assets/icons/fi_settings.svg?react";
import DatabaseIcon from "../../../../assets/icons/ph_database-light.svg?react";
import NextIcon from "../../../../assets/icons/next.svg?react";
import styles from "./TaskType.module.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Stack } from "@mui/material";
import { UpdateConfig } from "src/services/Portals/LLMPortals";

export const Taskype = ({ title, subTitle }) => {
  const navigate = useNavigate();
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const navigatetoPrepare = async (e) => {
    debugger;
    await UpdateConfig(experimentId,"train",{type:e==="pretrain"?"pretrain":"sft"});
    navigate(`/llm/${projectId}/Experiment/${experimentId}/${e}/prepare`);
  };
  
  return (
    <>
      <>
        <Box
          className={styles["type-title-ctn"]}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // margin: "10px 0",
          }}
        >
          <div
            style={{ flex: 1, display: "flex", flexDirection: "row" }}
            className={styles["page-title"]}
          >
            <div style={{ margin: "auto 0px", cursor: "pointer" }}>
              <BackIcon onClick={() => navigate(-1)} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "10px",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                {title}
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700" }}>
                {subTitle}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flex: 3,
            }}
          ></div>
        </Box>

        <div className={styles["type-page-caption"]}>
          Choose task type you wan to perform:
        </div>
        <Stack direction="row" spacing={2} sx={{ p: "0 20px" }}>
          <Box
            className={styles["cus-box"]}
            onClick={() => navigatetoPrepare("pretrain")}
          >
            <div className={styles["cus-ctn"]}>
              <div className={styles["img-box"]}>
                <DatabaseIcon />
              </div>
              <div>Pre-Train LLM</div>
            </div>
            <NavigateNextIcon />
          </Box>

          <Box
            className={styles["cus-box"]}
            onClick={() => navigatetoPrepare("sft")}
          >
            <div className={styles["cus-ctn"]}>
              <div className={styles["img-box"]}>
                <SettingsIcon className={styles["stroke-only"]}/>
              </div>
              <div>Fine-Tune LLM</div>
            </div>
            <NavigateNextIcon />
          </Box>
        </Stack>
      </>
    </>
  );
};
