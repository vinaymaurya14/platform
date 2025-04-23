import { Box, LinearProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInterval from "src/components/Elements/hooks/useInterval";
import {
  GetInfraStatus,
  GetListExperiments,
  GetTrainStatus,
  StopTraining,
  UpdateExp,
} from "src/services/Portals/LLMPortals";
import styles from "./LLMModelTrain.module.css";
export default function LLMModelTrain({ initialConfigs = {} }) {
  const { projectId, experimentId, taskType, model } = useParams();
  const [configs, setConfigs] = useState(initialConfigs);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(5000);
  const [experimentData, setExperimentData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusText, setStatusText] = useState([]);
  const [progress, setProgress] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [errormessage, seterrormessage] = useState();
  const [Text, setText] = useState("Stop Process");
  const navigate = useNavigate();
  useInterval(
    () => {
      console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  useInterval(() => {
    if (
      experimentData.status == "TRAINING" ||
      experimentData.status == "TRAINED" ||
      experimentData.status == "DEPLOYED"
    ) {
      setTimeElapsed(Math.round(experimentData.training_time / 60));
    }
  }, 1000);

  useEffect(() => {
    if (
      experimentData.status == "TRAINED" ||
      experimentData.status == "DEPLOYED"
    ) {
      setIsPollingStatus(false);
      setStatusText(["TRAINED"]);
      setProgress(100);
    } else {
      setIsPollingStatus(true);
      if (
        experimentData.status == "PREPROCESSED" ||
        experimentData.status == "PREPARED" ||
        experimentData.status == "CREATED"
      ) {
        GetInfraStatus(experimentId).then((res) => {
          let tempStatusText = [];
          for (let key in res.data) {
            tempStatusText.push(key + " : " + res.data[key]);
          }
          setStatusText(tempStatusText);
        });
      } else if (experimentData.status == "TRAINING") {
        setStatusText([]);
        GetTrainStatus(experimentId).then((res) => {
          setProgress(res.data.epochs * 100);
        });
      }
    }
    if (experimentData.status == "FAILED") {
      setIsPollingStatus(false);
      setStatusText(["FAILED"]);
      setProgress(0);
      setText("Dashboard");
      seterrormessage(
        "Platform encountered Runtime Error. Please try with new experiment"
      );
    }
  }, [experimentData]);
  useEffect(() => {
    fetchExperimentData();
  }, []);
  const fetchExperimentData = async () => {
    GetListExperiments("", experimentId)
      .then((res) => {
        if (res.status === 200) {
          setExperimentData(res.data[0]);
          // console.log(experimentData)
          setConfigs({ ...configs, ...res.data[0].train_config });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const stopTraining = () => {
    if (experimentData.status === "FAILED") {
      navigate(`/llm`);
      return;
    }
    StopTraining(experimentId).then((res) => {
      if (res.status != "SUCCESS") {
        UpdateExp(experimentId, "PREPROCESSED");
      }
      navigate("../", { replace: true });
      // setIsPollingStatus(false);
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <Box style={{ margin: "6px 0px 0px 0px" }}>
        <span className={styles["Selector-title"]}>
          <span className={styles["step"]}>Steps : 2/2</span>&nbsp;&nbsp;
          <span className={styles["tagline"]}>
            Cost of training and Time chart
          </span>
        </span>
      </Box>
      {experimentData.status != "FAILED" ? (
        <Box className={styles["progress-ctn"]}>
          <LinearProgress
            variant={progress == null ? "indeterminate" : "determinate"}
            value={progress == null ? null : progress}
            className={styles["progress-bar"]}
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#2F5711",
                borderRadius: "8px",
              },
            }}
          />
          {progress != null ? (
            <div
              className={styles["progress-percent-ctn"]}
              style={{ left: "calc(" + progress + "%)" }}
            >
              <span className={styles["progress-percent"]}>
                {Math.round(progress * experimentData.train_config.epochs) /
                  100}{" "}
                / {experimentData.train_config.epochs}
              </span>
              <span className={styles["progress-percent-ctn-tail"]}></span>
            </div>
          ) : null}

          <div className={styles["progress-labels-ctn-bottom"]}>
            {experimentData.status == "TRAINING" ||
            experimentData.status == "TRAINED" ||
            experimentData.status == "DEPLOYED" ? (
              <>
                <div>
                  {experimentData.status == "TRAINED" ||
                  experimentData.status == "DEPLOYED" ? (
                    <>
                      Total Cost of Training:{" "}
                      <span className={styles["progress-label-value"]}>
                        {" "}
                        ${" "}
                        {Math.round(
                          (timeElapsed *
                            experimentData?.train_config?.scaling_config
                              ?.n_gpus *
                            100) /
                            60
                        ) / 100}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}

            {experimentData.status == "TRAINED" ||
            experimentData.status == "DEPLOYED" ? (
              <>
                <div>
                  Total elapsed:{" "}
                  <span className={styles["progress-label-value"]}>
                    {" "}
                    {timeElapsed} mins
                  </span>
                </div>
                <div>
                  Time remaining:{" "}
                  <span className={styles["progress-label-value"]}>
                    {" "}
                    X mins
                  </span>
                </div>
              </>
            ) : (
              ""
            )}
          </div>

          <div className={styles["progress-labels-ctn-top"]}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
              }}
            >
              {statusText.map((text, index) => {
                return <div key={index}>{text}</div>;
              })}
            </div>
          </div>
        </Box>
      ) : (
        <Alert severity="error">
          <AlertTitle>FAILED</AlertTitle>
          {errormessage}
        </Alert>
      )}

      {experimentData.status == "TRAINED" ||
      experimentData.status == "DEPLOYED" ||
      experimentData.status == "TRAINING" ? (
        <Box className={styles["chart-ctn"]}>
          <iframe
            src={
              "https://cibi.ai/cibi/grafana/d/ecddfeaf-d0de-4b10-8007-41143c53ec40/llm-valuation-and-evaluation-metrics?orgId=1&from=1705047988397&to=1705048031454&var-experiment=" +
              experimentId +
              "&kiosk&refresh=5s&theme=light"
            }
            width="100%"
            height="328px"
            style={{ border: "none" }}
          />
        </Box>
      ) : null}
      {experimentData.status != "TRAINED" ? (
        <div style={{ textAlign: "center" }}>
          <button className={styles["stop-btn"]} onClick={stopTraining}>
            {Text}
          </button>
        </div>
      ) : null}
    </div>
  );
}
