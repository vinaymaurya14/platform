import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/styled-engine";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BackIcon from "../../../assets/icons/back.svg?react";
import NextIcon from "../../../assets/icons/next.svg?react";
import styles from "./PageHeader.module.css";

export default function PageHeader({
  title, 
  subTitle, 
  tabs,
  labels = {},
  selectedTab, 
  isTabDisabled, 
  onTabClick,  
  hideNextButton = false,
  nextPagePath, 
  enableNext}) {
  // const experimentId = useParams().experimentId;
  // const projectId = useParams().projectId;
  const navigate = useNavigate();


  




  return (
    <StyledEngineProvider injectFirst>
      <Box
        className={styles["page-title-ctn"]}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px 0",
        }}
      >
        <div
          style={{ flex: 1, display: "flex", flexDirection: "row" }}
          className={styles["page-title"]}
        >
          <div style={{margin:"auto 0px", cursor:"pointer"}} >
            <BackIcon onClick={() => navigate(-1)}/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft:"10px" }}>
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
        >
          <div className={styles["tab-ctn"]}>
            {tabs.map((tab, index) => (
                <div
                  className={(selectedTab == tab ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled(tab) ? styles["disabled"] : "")}
                  style={ index == 0 ? {
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    borderRight: "0px"
                  } : index == tabs.length - 1 ? {
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  } : {
                    borderRight: "0px"
                  }}
                onClick={() => onTabClick(tab)}
              >
                <div className={styles["tab-number-ctn"]}>{index+1}</div>&nbsp;<span style={{textTransform:"capitalize"}}>{labels[tab] ||tab}</span>
              </div>
              ))
            }
            
            {/* <div className={(selectedTab == "train" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("train") ? styles["disabled"] : "")} onClick={() => onTabClick("train")} style={{borderRight: "0px"}}>
              <div className={styles["tab-number-ctn"]}>2</div>&nbsp;<span>Train</span>
            </div>
            <div className={(selectedTab == "deploy" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("deploy") ? styles["disabled"] : "")} onClick={() => onTabClick("deploy")} style={{borderRight: "0px"}}>
              <div className={styles["tab-number-ctn"]}>3</div>&nbsp;<span>Deploy</span>
            </div>
            <div
              className={(selectedTab == "reports" ? styles["tab"] + " " + styles["selected"] : styles["tab"]) + " " + (isTabDisabled("reports") ? styles["disabled"] : "")} onClick={() => onTabClick("reports")}
              style={{
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            >
              <div className={styles["tab-number-ctn"]}>4</div>&nbsp;<span>Report</span>
            </div> */}
          </div>
        </div>
        <div className={styles["page-action"]} style={{ flex: 1 }}>
          {(hideNextButton) ? null : (
            <button
            className="gradient-background"
            disabled={!enableNext}
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "16px",
              alignItems: "center",
              gap: "4px",
            }}
            onClick={() => navigate(nextPagePath)}
          >
            Next
            <NextIcon />
          </button>
          )}
        </div>
      </Box>
    </StyledEngineProvider>
  );
}
