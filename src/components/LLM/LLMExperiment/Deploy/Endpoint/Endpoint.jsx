import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { LableNames } from "../../../../Elements/Styles";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Deploy,
  GetDeploymentStatus,
  GetIngressURL,
  GetListExperiments,
} from "../../../../../services/Portals/LLMPortals";
import "react-js-cron/dist/styles.css";
import "./Endpoint.css";
import CircularProgress from "@mui/material/CircularProgress";
import Buttons from "../../../../Elements/Buttons";
import { useParams, useNavigate } from "react-router-dom";
import useInterval from "src/components/Elements/hooks/useInterval";

const Endpoint = ({ onChildClick }) => {
  const navigate = useNavigate();
  const projectId = useParams().projectId;
  const { experimentId } = useParams();
  const [deployType, setDeployType] = useState("realtime");
  const [isPollingStatus, setIsPollingStatus] = useState(true);
  const [DeployBnt, setDeployBnt] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(1000);
  const [message, setMessage] = useState("");
  const [ingcheck, setingcheck] = useState(false);
  const [docurl, setdocurl] = useState(false);
  const [ingressUrl, setingressUrl] = useState();
  const [rescolor, setrescolor] = useState(false);
  const [EPInputs, setEPInputs] = useState({
    podMin: "1",
    podMax: "1",
    memMin: "0.5",
    memMax: "1",
    cpuMin: "1000",
    cpuMax: "1100",
    lifestage: "Production",
    StageWeight: "0",
  });

  const [Loader, setLoader] = useState(false);
  const selectDeployment = (type) => {
    setDeployType(type);
  };
  const handleEPChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEPInputs((values) => ({ ...values, [name]: value }));
  };
  const MenuProps = {
    PaperProps: {
      style: {
        height: "200px",
        width: 100,
      },
    },
  };

  const handleEPSubmit = () => {
    setLoader(true);
    Deploy(experimentId)
      .then((res) => {
        console.log("deploy---", res);
        if (res.status === 200) {
          setIsPollingStatus(true);
          setMessage(
            "Deployment is ongoing, please wait till the service is healthy."
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  function isUrlValid(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  function isUrlValid(string) {
    console.log(string);
    let isValid;
    try {
      new URL(string);
      isValid = true;
    } catch (err) {
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  }

  const getDeploymentStatus = async () => {
    GetDeploymentStatus(ingressUrl).then(async (res) => {
      console.log("Health check url", res);
      if (res.status == 200) {
        setLoader(false);
        setMessage("Service is now live and Healthy");
        setLoader(false);
        setDeployBnt(true);
        setrescolor(true);
        setdocurl(false);
      }
    });
  };

  const getValidIngressURL = () => {
    GetIngressURL(experimentId).then(async (res) => {
      console.log("ingress-url", res.data.ingress);
      if (res.status === 200) {
        if (isUrlValid("https://" + res.data.ingress + "/docs")) {
          setingcheck(false);
          console.log("valid url", res.data.ingress);
          setdocurl(true);
          setingressUrl(res.data.ingress + "/docs");
        } else {
          setMessage(
            "Deployment is complete, please wait till the service is healthy."
          );
        }
      }
    });
  };

  const fetchExperimentData = async () => {
    GetListExperiments("", experimentId).then((res) => {
      console.log("exp-status", res.data[0].status);
      if (res.data[0].status === "DEPLOYED") {
        setingcheck(true);
        setIsPollingStatus(false);
        setDeployBnt(true);
        setLoader(true);
        setMessage(
          "Deployment is complete, please wait till the service is healthy."
        );
      }
    });
  };

  useInterval(
    () => {
      //console.log("Polling");
      fetchExperimentData();
    },
    isPollingStatus ? pollingInterval : null
  );

  useInterval(
    () => {
      //console.log("Polling");
      getValidIngressURL();
    },
    ingcheck ? pollingInterval : null
  );

  useInterval(
    () => {
      //console.log("Polling");
      getDeploymentStatus();
    },
    docurl ? pollingInterval : null
  );
  return (
    <>
      {/* <Grid container>

                <Box sx={{ margin: "20px" }}>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>Pods</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>Memory</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Stack>
                            <Box class="label">
                                <Typography>CPU</Typography>
                            </Box>
                        </Stack>
                        <Stack spacing={4} direction="row">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment className="input-label" position="start">
                                                Min
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                Max
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Grid> */}

      <Stack spacing={4} sx={{ p: 2 }}>
        <Box>
          <LableNames>Pods</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                name="podMin"
                value={EPInputs.podMin || ""}
                id="reddit-input"
                variant="filled"
                onChange={handleEPChange}
                className="deployinput"
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="podMax"
                value={EPInputs.podMax || ""}
                id="reddit-input"
                variant="filled"
                onChange={handleEPChange}
                className="deployinput"
              />
            </Box>
          </Stack>
        </Box>
        <Box>
          <LableNames>Memory</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                label="Minimum"
                name="memMin"
                value={EPInputs.memMin || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Gigabytes</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="memMax"
                value={EPInputs.memMax || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Gigabytes</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "5px",
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mt: 0 }}>
          <LableNames>CPU</LableNames>
          <Stack spacing={4} direction="row">
            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Min</label>
              <input
                label="Minimum"
                name="cpuMin"
                value={EPInputs.cpuMin || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                className="deployinput"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Milliseconds</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ width: "300px", position: "relative" }}>
              <label className="deploylabel">Max</label>
              <input
                label="Maximum"
                name="cpuMax"
                className="deployinput"
                value={EPInputs.cpuMax || ""}
                onChange={handleEPChange}
                id="reddit-input"
                variant="filled"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Milliseconds</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputAdornment-root": {
                    "& .MuiTypography-root": {
                      fontSize: "10px",
                      fontFamily: "Glegoo",
                      fontWeight: 400,
                      mt: "19px",
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "end", width: "100%", float: "right" }}>
          {Loader ? (
            <CircularProgress />
          ) : (
            <Box sx={{ width: "200px", float: "right" }}>
              <Buttons
                label={"Deploy"}
                disabled={DeployBnt ? true : false}
                onClick={handleEPSubmit}
              />
            </Box>
          )}
          <Box
            style={{
              float: "left",
              color: rescolor ? "#13a313" : "#f7a104",
            }}
          >
            {message}
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Endpoint;
