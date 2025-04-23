import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useInterval from "src/components/Elements/hooks/useInterval";

import styles from "./FineTune.module.css";
import {
  Box,
  Grid,
  Button,
  Typography,
  Dialog,
  TextField,
  Card,
  CircularProgress,
} from "@mui/material";
import Fileupload from "../../../../../assets/images/fi_upload.svg?react";

import CardContent from "@mui/material/CardContent";
import Document from "../../../../../assets/images/Document.svg";
import Alert from "@mui/material/Alert";

import {
  GetListExperiments,
  UpdateConfig,
  UpdateExp,
  UploadFileTos3,
  data_signed_url,
} from "src/services/Portals/LLMPortals";
export default function FineTune(props) {
  const { projectId, experimentId, taskType } = useParams();
  const [uploadFile, setuploadFile] = useState();
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState();
  const [s3Location, setS3Location] = useState();
  const [experimentData, setExperimentData] = useState({});
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const experimentStatus = useRef("");
  const [errorMesg, seterrorMesg] = useState();

  const navigate = useNavigate();

  const fetchExperimentData = () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentData(res.data[0]);
          experimentStatus.current = res.data[0].status;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchExperimentData();
  }, []);

  const handleFileSelect = (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      setFileData(e.target.files[0]);
    }
  };

  const handleNext = async () => {
    setShowLoader(true);
    seterrorMesg("");
    let tempS3Location = s3Location;
    if (fileData) {
      let res = await UploadFileTos3(fileData, experimentId, "PreparePage");
      if (res?.s3Res?.status != 200) {
        console.log("Error in uploading file", res);
        setShowLoader(false);
        seterrorMesg("Upload failed please try again");
        return;
      }
      tempS3Location = decodeURIComponent(
        res.s3Res.url
          .split("?")[0]
          .replace(".s3.amazonaws.com", "")
          .replace("https://", "s3://")
      );
      setS3Location(tempS3Location);
    }
    if (
      tempS3Location.endsWith(".csv") ||
      tempS3Location.endsWith(".parquet")
    ) {
      console.log("Preprocessing");
      let res2 = await UpdateConfig(experimentId, "data", {
        input: tempS3Location,
        // text:"sentence",
        type: taskType == "pretrain" ? "pretrain" : "sft",
      }).catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
      if (res2.status != 200) {
        console.log("Error in updating config", res2);
        setShowLoader(false);
        return;
      }
      let res3 = await UpdateExp(experimentId, "PREPARED").catch((err) => {
        setShowLoader(false);
        console.log(err);
      });
      if (res3.status != 200) {
        console.log("Error in updating expeiment status", res2);
        setShowLoader(false);
        return;
      }

      setShowLoader(false);
      navigate("preview");
      // await Preprocess(experimentId)
      // await isReady()
      // console.log("Preprocessing Done", experimentData)
      // await UpdateConfig()
    } else {
      UpdateConfig(experimentId, "train", {
        data_uri: tempS3Location,
      })
        .then((res) => {
          if (res.status == 200) {
            UpdateExp(experimentId, "PREPROCESSED");
            navigate(`/llm/${projectId}/experiment/${experimentId}/sft/train`);
          }
        })
        .catch((err) => {
          setIsPollingStatus(false);
          setShowLoader(false);
          seterrorMesg("Update Config failed please try again");
        });
    }
  };

  return (
    <>
      <div className={styles["UploadSection"]}>
        <Grid container>
          <div className={styles["page-caption"]}>
            <span className={styles["tagline"]}>
              Upload the supported files
            </span>
          </div>
        </Grid>

        <div className={styles["section"]}>
          <div
            className={styles["left-section"]}
            style={{ background: "#fff" }}
          >
            <div className={styles["uploadtitle"]}>
              <h4>Upload Data or Add S3 Location</h4>
            </div>
            <div className={styles["supportfile"]}>
              Supported files are ".csv" and ".parquet"
            </div>
            <Box className={s3Location ? styles["disabled"] : ""}>
              <Card
                item
                sx={{
                  margin: 0,
                  cursor: s3Location ? "not-allowed" : "pointer",
                  border: "1px dashed #4A4A52",
                  boxShadow: "none",
                }}
              >
                <CardContent sx={{ p: 6 }}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Box margin={1}>
                      <Fileupload />
                    </Box>
                    <Box margin={1}>
                      <input
                        hidden
                        accept=".csv,.parquet"
                        // multiple
                        type="file"
                        ref={inputFile}
                        onChange={handleFileSelect}
                      />
                      <Typography
                        sx={{
                          color: "#000B34",
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 400,
                          fontSize: "16px",
                        }}
                      >
                        <span
                          onClick={() => {
                            {
                              s3Location ? "" : inputFile.current.click();
                            }
                          }}
                        >
                          <span className={styles["draganddrop"]}>
                            {" "}
                            Drag and Drop or{" "}
                          </span>

                          <font
                            className={styles["draganddrop"]}
                            style={{ textDecoration: "underline" }}
                          >
                            Choose file
                          </font>

                          <span className={styles["draganddrop"]}>
                            {" "}
                            to upload
                          </span>
                        </span>{" "}
                      </Typography>
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
            {fileData && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    gap: "10px",
                    background: "#efeff2",
                    width: "fit-content;",
                    borderRadius: "8px",
                    m: 0,
                  }}
                >
                  <Box className={styles["FileName"]}>{fileData.name}</Box>
                  <Box
                    className={styles["close"]}
                    onClick={() => {
                      inputFile.current.value = "";
                      setFileData(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M12 4L4 12"
                        stroke="#A8200D"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 4L12 12"
                        stroke="#A8200D"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Box>
                </Box>
              </>
            )}

            <div className={styles["sectiondivied"]}>
              <center>
                <div className={styles["OR-Box"]}>
                  <p className={styles["text"]}>OR</p>
                </div>
              </center>
            </div>

            <div
              className={
                styles["supportfile"] +
                " " +
                (fileData ? styles["disabled"] : "")
              }
            >
              Add S3 Location
            </div>

            <div
              className={
                styles["s3input"] + " " + (fileData ? styles["disabled"] : "")
              }
            >
              <input
                type="text"
                placeholder="S3 Location"
                value={s3Location}
                disabled={fileData ? true : false}
                onChange={(e) => setS3Location(e.target.value)}
              ></input>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleNext}
                className="gradient-background"
                disabled={!(fileData || s3Location) || showLoader}
              >
                Next
                <CircularProgress
                  size={20}
                  style={{
                    display: showLoader ? "block" : "none",
                    color: "white",
                  }}
                />
              </button>
            </div>
            {errorMesg && (
              <center>
                <span style={{ color: "red" }}>
                  <Alert severity="error">{errorMesg}</Alert>
                </span>
              </center>
            )}
          </div>
          {/* <div
            className={styles["left-section"]}
            style={{ background: "#EEEEF8" }}
          >
            <Grid
              xs={6}
              sx={{ display: "flex", p: 1, borderBottom: "1px solid #D3D3EA" }}
              className="Engineered-Features"
            >
              <img src={Document} className={styles["EF-Img"]}></img>
              <h4 className={styles["EngFeatures"]}>
                Guidelines on 'Creating the training data'
              </h4>
            </Grid>

            <div className={styles["uploaddetails"]}>
              <h2>Title 01</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <h2>Title 02</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <h2>Title 03</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
