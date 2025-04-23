import React, { useState, useEffect, useRef } from "react";

import styles from "./PreTrain.module.css";
import { Box, Grid, Typography, Card, CircularProgress } from "@mui/material";
import Fileupload from "../../../../../assets/images/fi_upload.svg?react";
import { useParams, useNavigate } from "react-router-dom";
import CardContent from "@mui/material/CardContent";
import Document from "../../../../../assets/images/Document.svg";
import useInterval from "src/components/Elements/hooks/useInterval";
import Alert from "@mui/material/Alert";

import {
  Preprocess,
  GetDataPreview,
  GetListExperiments,
  UpdateConfig,
  UpdateExp,
  UploadFileTos3,
  data_signed_url,
} from "src/services/Portals/LLMPortals";

import LinearProgress from "@mui/material/LinearProgress";

export default function PreTrain() {
  const projectId = useParams().projectId;
  const experimentId = useParams().experimentId;
  const { taskType } = useParams();
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState();
  const [errorMesg, seterrorMesg] = useState();
  const [s3input, sets3input] = useState(true);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(2000);
  const [loader, setloader] = useState(false);
  const [selectDatashow, setselectDatashow] = useState(false);
  const [TargetColumn, setTargetColumn] = useState();
  const [previewData, setpreviewData] = useState([]);
  const [GetdataAPI, setGetdataAPI] = useState(false);
  const [Preprocessing, setPreprocessing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [NextBnt, setNextBnt] = useState(false);

  const [s3Location, setS3Location] = useState();
  const [filter, setfilter] = useState(false);

  const navigate = useNavigate();
  const handleImageUpload = (e) => {
    seterrorMesg("");

    let file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      setFileData(e.target.files[0]);
    }
    sets3input(false);
  };
  const UploadFileToBucket = async () => {
    seterrorMesg("");
    setShowLoader(true);
    let tempS3Location = s3Location;
    if (fileData) {
      let res = await UploadFileTos3(fileData, experimentId, "PreparePage");
      if (res?.s3Res?.status != 200) {
        setShowLoader(false);
        console.log("Error in uploading file", res);
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
      await UpdateConfig(experimentId, "data", {
        input: tempS3Location,
        // text:"sentence",
        type: taskType == "pretrain" ? "pretrain" : "sft",
      });
      await UpdateExp(experimentId, "PREPARED");
      navigate("preview");
      //setGetdataAPI(true);
      // await Preprocess(experimentId)
      // await isReady()
      // console.log("Preprocessing Done", experimentData)
      // await UpdateConfig()
    } else {
      console.log("Folder");
      setShowLoader(true);
      const data = {
        data_uri: s3Location,
      };

      UpdateConfig(experimentId, "train", data)
        .then((res) => {
          console.log("UpdataTrain", res);
          if (res.status === 200) {
            setIsPollingStatus(false);
            setShowLoader(false);
            UpdateExp(experimentId, "PREPROCESSED");
            setfilter(true);
            navigate(
              `/llm/${projectId}/Experiment/${experimentId}/pretrain/train`,
              {
                state: {
                  filter: filter,
                },
              }
            );
          }
        })
        .catch((err) => {
          setIsPollingStatus(false);
          setShowLoader(false);
          seterrorMesg("Update train failed please try again");
        });
    }
  };

  const Datapreview = () => {
    GetDataPreview(experimentId, "")
      .then((DataRes) => {
        if (DataRes.status === 200) {
          const keys = DataRes.data.flatMap((obj) => Object.keys(obj));
          const uniqueKeys = [...new Set(keys)];
          setpreviewData(uniqueKeys);
          setShowLoader(false);
          setselectDatashow(true);
          setloader(false);
        }
      })
      .catch((err) => {
        setloader(false);
        seterrorMesg("Data Preview failed please try again");
      });
  };

  const TargetColumnSubmit = () => {
    setShowLoader(true);
    const data = {
      text: TargetColumn,
    };
    UpdateConfig(experimentId, "data", data)
      .then((res) => {
        console.log("TargetupdataconfigRESponse", res);
        if (res.status === 200) {
          navigate(
            `/llm/${projectId}/Experiment/${experimentId}/pretrain/train`
          );
          // setPreprocessing(true);
        }
      })
      .catch((err) => {
        setShowLoader(false);
        seterrorMesg("Target Column failed please try again");
      });
  };

  const fetchPreprocessing = () => {
    Preprocess(experimentId)
      .then((res) => {
        console.log("preprocessing", res);
        if (res.status === 200) {
          setIsPollingStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
        seterrorMesg("Pre-processing failed please try again");
      });
  };

  useEffect(() => {
    if (Preprocessing) {
      fetchPreprocessing();
    }
  }, [Preprocessing]);

  useEffect(() => {
    if (GetdataAPI) {
      Datapreview();
    }
  }, [GetdataAPI]);

  useEffect(() => {
    if (fileData) {
      // UploadFileToBucket();
    }
  }, [fileData]);

  useInterval(
    () => {
      //console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );
  const fetchExperimentData = async () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          console.log("exp-status", res.data[0].status);
          if (res.data[0].status === "FAILED") {
            seterrorMesg("Experiment failed");
            setShowLoader(false);
            setIsPollingStatus(false);
          }
          if (res.data[0].status === "PREPROCESSED") {
            const data = {
              data_uri: res.data[0].preprocessed_input,
            };
            UpdateConfig(experimentId, "train", data)
              .then((res) => {
                console.log("UpdataTrain", res);
                if (res.status === 200) {
                  setPreprocessing(true);
                  setIsPollingStatus(false);
                  navigate(
                    `/llm/${projectId}/Experiment/${experimentId}/pretrain/train`
                  );
                }
              })
              .catch((err) => {
                setloader(false);
                setIsPollingStatus(false);
                seterrorMesg("Update train failed please try again");
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              <h4>Upload Data</h4>
            </div>

            {selectDatashow ? (
              <>
                <div className={styles["supportfile"]}>Target Column</div>
                <div className={styles["s3input"]}>
                  <select
                    onChange={(e) => {
                      setTargetColumn(e.target.value);
                      setNextBnt(true);
                    }}
                    style={{ textTransform: "capitalize" }}
                  >
                    {previewData.map((item) => (
                      <>
                        <option value={item}>{item}</option>
                      </>
                    ))}
                  </select>
                </div>
                <center>
                  <span style={{ color: "red" }}>
                    <b>{errorMesg}</b>
                  </span>
                </center>

                <div className={styles["target-bnt"]}>
                  <div>
                    {loader ? (
                      <CircularProgress
                        className={styles["progress"]}
                      ></CircularProgress>
                    ) : null}
                  </div>
                  <button
                    className={styles["cancelbnt"]}
                    onClick={() => setselectDatashow(false)}
                  >
                    Back
                  </button>
                  <button
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onClick={TargetColumnSubmit}
                    className="gradient-background"
                    disabled={NextBnt ? false : true}
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
              </>
            ) : (
              <>
                <div className="uploadfile">
                  <div className={styles["supportfile"]}>
                    Support files are “.csv”
                  </div>
                  <Card
                    item
                    sx={{
                      margin: 1,
                      cursor: "pointer",
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
                            accept=".csv"
                            // multiple
                            type="file"
                            ref={inputFile}
                            onChange={handleImageUpload}
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
                                inputFile.current.click();
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
                  {fileData && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          background: "#efeff2",
                          width: "fit-content;",
                          borderRadius: "8px",
                          m: 1,
                        }}
                      >
                        <Box className={styles["FileName"]}>
                          {fileData.name}
                        </Box>
                        <Box className={styles["close"]}>
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

                  <div className={styles["supportfile"]}>Add S3 Location</div>
                  <div className={styles["s3input"]}>
                    <input
                      type="text"
                      value={s3Location}
                      onChange={(e) => setS3Location(e.target.value)}
                      disabled={s3input ? false : true}
                    ></input>
                  </div>
                  {errorMesg && (
                    <center>
                      <span style={{ color: "red" }}>
                        <Alert severity="error">{errorMesg}</Alert>
                      </span>
                    </center>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "10px",
                    }}
                  >
                    <button
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                      onClick={UploadFileToBucket}
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

                  {/* <Box sx={{ width: "95%", mr: 1 ,display:"flex"}}>
                <LinearProgress
                  variant="determinate"
                  value={(stepProgress / 3) * 100}
                  color="success"
                  className={styles["stepslinerprogress"]}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round((stepProgress / 3) * 100)}%
                </Typography>
              </Box> */}
                </div>
              </>
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
