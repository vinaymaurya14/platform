import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";
import styles from "./FineTune.module.css";
import {
  Box,
  Grid,
  Button,
  Typography,
  Dialog,
  TextField,
  Card,
  Select,
  MenuItem,
} from "@mui/material";
import Fileupload from "../../../../../assets/images/fi_upload.svg?react";

import CardContent from "@mui/material/CardContent";
import Document from "../../../../../assets/images/Document.svg";
import useInterval from "src/components/Elements/hooks/useInterval";
import ph_database from "../../../../../assets/images/ph_database-light.svg";
import {
  GetDataPreview,
  GetListExperiments,
  Preprocess,
  UpdateConfig,
} from "src/services/Portals/LLMPortals";
import Alert from "@mui/material/Alert";

export default function DataPreview() {
  const { projectId, experimentId, taskType } = useParams();
  const [uploadFile, setuploadFile] = useState();
  const [experimentData, setExperimentData] = useState({});
  const inputFile = useRef(null);
  const experimentStatus = useRef("");
  const processedInput = useRef("");
  const [columns, setColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [columnDef, setColumnDef] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [nextLoader, setNextLoader] = useState(false);
  const [target, setTarget] = useState("");
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(1000);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [errorMesg, seterrorMesg] = useState("");
  const navigate = useNavigate();
  useInterval(
    () => {
      console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  const isReady = async () => {
    while (true) {
      if (experimentStatus.current == "PREPROCESSED") {
        return true;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  };
  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentData(res.data[0]);
          experimentStatus.current = res.data[0].status;
          if (res.data[0]?.preprocessed_input) {
            processedInput.current = res.data[0].preprocessed_input;
          }
          return res.data[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDataPreview = () => {
    setShowLoader(true);
    
    GetDataPreview(experimentId, prompt)
      .then((res) => {
        if (res.status === 200) {
          console.log();
          setColumns(Object.keys(res.data[0]));
          setPreviewData(
            res.data.map((row, index) => {
              row["id"] = index;
              return row;
            })
          );
          setColumnDef(
            Object.keys(res.data[0]).map((column) => {
              return {
                field: column,
                headerName: column,
                flex: column == "prompt" ? 2 : 1,
              };
            })
          );
          setShowLoader(false);
          debugger;
          if ("prompt" in res.data[0]) {
            setHasPrompt(true);
          } else {
            setHasPrompt(false);
          }
        } else {
          setShowLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  const submitPreprocess = async () => {
    setNextLoader(true);
    seterrorMesg();
    if (!prompt) {
      setNextLoader(false);
      seterrorMesg("Prompt Missing");
      return;
    }
    UpdateConfig(experimentId, "data", {
      prompt: prompt,
      target: target,
      type: taskType == "pretrain" ? "pretrain" : "sft",
    })
      .then((res) => {
        if (res.status === 200) {
          navigate(
            `/llm/${projectId}/Experiment/${experimentId}/${taskType}/train`
          );
        } else {
          setNextLoader(false);
        }
      })
      .catch((err) => {
        setNextLoader(false);
        seterrorMesg("Text column failed please try again");
      });
  };

  useEffect(() => {
    fetchExperimentData();
    fetchDataPreview();
  }, [experimentId]);

  return (
    <>
      <div className={styles["UploadSection"]}>
        <Grid container>
          <div className={styles["page-caption"]}>
            <span className={styles["tagline"]}>Preview your target data</span>
          </div>
        </Grid>
        <div>
          <div className={styles["top-section"]} style={{ background: "#fff" }}>
            <div className={styles["uploadtitle"]}>
              <h4>Data Preview and Prompt Templating</h4>
            </div>

            <div className={styles["uploadfile"]}>
              <div className={styles["supportfile"]}>Text Column</div>
              <div className={styles["s3input"]}>
                <Select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  sx={{
                    width: "100%",
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    boxShadow: "none",
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        border: 0,
                      },
                    "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        border: 0,
                      },
                    "& .MuiSelect-select": {
                      padding: "0px",
                    },
                    "& fieldset": {
                      border: 0,
                      outline: "none",
                      "&:focus-visible": {
                        outline: "none",
                        border: 0,
                      },
                    },
                  }}
                >
                  {columns.map((column) => {
                    return <MenuItem value={column}>{column}</MenuItem>;
                  })}
                </Select>
                {/* <select
                  
                >
                  {columns.map((column) => {
                    return (<option value={column}>{column}</option>)
                  })}
                </select> */}
              </div>

              <div className={styles["supportfile"]}>Prompt</div>
              <div className={styles["s3input"]}>
                <textarea
                  style={{ height: "100px", width: "-webkit-fill-available" }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Use information from {column 1} to do something specific, like {column 2}"
                ></textarea>

                {/* <button
                  className="gradient-background"
                  style={{
                    float: "right",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                  onClick={fetchDataPreview}
                  disabled={showLoader}
                >
                  Preview
                  <CircularProgress size={20} style={{ display: showLoader ? "block" : "none" }} />
                </button> */}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {nextLoader ? (
                  <div
                    style={{ marginRight: "30px" }}
                    className={styles["blinker"]}
                  >
                    Processing input...
                  </div>
                ) : null}
                <button
                  style={{ padding: "0px 23px", height: "44px" }}
                  className="gradient-background"
                  onClick={fetchDataPreview}
                  disabled={showLoader}
                >
                  Preview
                  {showLoader ? (
                    <CircularProgress
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "white",
                        marginLeft: "5px",
                      }}
                      className={styles["progress"]}
                    ></CircularProgress>
                  ) : null}
                </button>
                <button
                  style={{
                    padding: "0px 23px",
                    height: "44px",
                    marginLeft: "10px",
                  }}
                  className="gradient-background"
                  onClick={submitPreprocess}
                  disabled={!target || nextLoader || showLoader}
                >
                  Next
                  {nextLoader ? (
                    <CircularProgress
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "white",
                        marginLeft: "5px",
                      }}
                      className={styles["progress"]}
                    ></CircularProgress>
                  ) : null}
                </button>{" "}
              </div>
              {errorMesg && (
                <center>
                  <span style={{ color: "red" }}>
                    <Alert sx={{width:"300px",float:"right"}} severity="error">{errorMesg}</Alert>
                  </span>
                </center>
              )}
            </div>
          </div>
          <div
            className={styles["bottom-section"]}
            style={{ background: "#fff" }}
          >
            <Grid
              xs={6}
              sx={{ display: "flex", p: 1, borderBottom: "1px solid #D3D3EA" }}
              className="Engineered-Features"
            >
              <img src={ph_database} className={styles["EF-Img"]}></img>
              <h4 className={styles["EngFeatures"]}>Data Preview</h4>
            </Grid>

            <div className={styles["uploaddetails"]}>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={previewData}
                  columns={columnDef}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  pagination
                  getRowId={(row) => row.id}
                  sx={{
                    m: 1,

                    "& .MuiDataGrid-columnHeaders": {
                      background: "#1F1F29",
                      color: "#fff",
                      height: "10px",
                      minHeight: "40px !important",
                      maxHeight: "40px !important",
                      "&:hover": {
                        color: "#fff",
                      },
                    },
                    "& .MuiDataGrid-row": {
                      minHeight: "40px !important",
                      maxHeight: "40px !important",
                    },
                    "& .MuiDataGrid-cell": {
                      minHeight: "40px !important",
                      maxHeight: "40px !important",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
