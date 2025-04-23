import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  GetListExperiments,
  getLLMProjectDetails,
  CreateExperiment,
} from "../../../services/Portals/LLMPortals";
import Box from "@mui/material/Box";
import { StyledEngineProvider, Button } from "@mui/material";
import styles from "./Project.module.css";
import DocumentIcon from "../../../assets/icons/document.svg?react";
import TimeCircleIcon from "../../../assets/icons/timecircle.svg?react";
import CreateExp from "../../common/CreateExp/CreateExp";
import BackIcon from "../../../assets/icons/back.svg?react";
import PlusCircleIcon from "../../../assets/icons/pluscircle.svg?react";
import ListExperiments from "../../common/ListExperiments/ListExperiments";

export default function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({ experiments: [] });
  const [showCreateDialogBox, setCreateShowDialogBox] = useState(false);
  const [experimentsColumnDef, setExperimentsColumnDef] = useState([]);
  const formatDate = (timeStamp) =>
    new Date(timeStamp || null).toISOString().split("T")[0] +
    " " +
    new Date(timeStamp || null).toLocaleTimeString();
  const getProjectData = () => {
    getLLMProjectDetails(projectId)
      .then((res) => {
        if (res.status === 200) {
          let temp = res.data;
          GetListExperiments(projectId, "")
            .then((res2) => {
              if (res2.status === 200) {
                temp["experiments"] = res2.data;
                // console.log(temp);
                setProjectData(temp);
                if (temp["experiments"].length > 0) {
                  let colDefs = [];
                  const keys = Object.keys(temp["experiments"][0]);

                  keys.forEach((key) => {
                    if (key == "train_config") {
                      // do nothing
                    } else {
                      colDefs.push({
                        field: key,
                        headerName: key.split("_").join(" "),
                        sortable: false,
                        flex: 1,
                        valueFormatter:
                          key == "ts"
                            ? (params) => formatDate(params.value)
                            : (params) => params.value,
                      });
                    }
                  });
                  colDefs.push({
                    field: "train_config",
                    headerName: "Type",
                    sortable: false,
                    flex: 1,
                    valueFormatter: (params) =>
                      params?.value?.type == "pretrain"
                        ? "Pretrain"
                        : params?.value?.type == "sft"
                        ? "Finetune"
                        : "",
                  });
                  //  console.log(colDefs);
                  setExperimentsColumnDef(colDefs);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProjectData();
  }, []);

  const onCreateSuccess = (childStateValue) => {
    setCreateShowDialogBox(childStateValue);
    getProjectData();
  };

  const GotoExperiments = (e, id) => {
    console.log(e.row.status);
    if (e.row.status === "FAILED") {
      return;
    } else {
      navigate("Experiment/" + e.row.exp_id);
    }
  };
  return (
    <StyledEngineProvider injectFirst>
      <div style={{ padding: "16px 0 0 24px" }}>
        <BackIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/llm")}
        />
      </div>
      <Box
        className={styles["page-title-ctn"]}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "8px 24px 24px 24px",
          height: "44px",
          gap: "24px",
        }}
      >
        <div style={{ flex: 0.75 }} className={styles["page-title"]}>
          {projectData.proj_name}
        </div>
        <div style={{ flex: 1.25 }}>
          <span className={styles["card-description"]}>
            {projectData.description}
          </span>
        </div>
        <Box
          sx={{
            display: "flex",
            // flex: 0.5,
            width: "max-content",
            flexDirection: "row",
            mb: 1,
            mt: 2,
            alignItems: "center",
            fontSize: "12px",
            justifyContent: "center",
            // ml:5,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#eee9fd",
              borderRadius: "50%",
              padding: "7px",
              marginRight: "6px",
            }}
          >
            <DocumentIcon style={{ width: "18px", height: "18px" }} />{" "}
          </div>
          <div>
            <span
              style={{ fontWeight: 700, fontSize: "14px", lineHeight: "20px" }}
            >
              {projectData.experiments.length}
            </span>{" "}
            <span className={styles["card-label"]}>Experiments</span>
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            // flex: 0.75,
            width: "max-content",
            flexDirection: "row",
            mb: 1,
            mt: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#eee9fd",
              borderRadius: "50%",
              padding: "7px",
              marginRight: "6px",
            }}
          >
            {" "}
            <TimeCircleIcon style={{ width: "18px", height: "18px" }} />{" "}
          </div>
          <span
            style={{ fontSize: "12px", fontWeight: "500", color: "#6E6E88" }}
          >
            {" "}
            {formatDate(projectData.ts)}{" "}
          </span>
        </Box>
        <div className={styles["page-action"]} style={{ width: "max-content" }}>
          <Button
            className={styles["page-action-btn"]}
            onClick={() => setCreateShowDialogBox(true)}
          >
            <PlusCircleIcon />
            <span>Add Experiment</span>
          </Button>
          {showCreateDialogBox ? (
            <CreateExp
              onChildClick={onCreateSuccess}
              projectId={projectId}
              CreateExperiment={CreateExperiment}
            />
          ) : (
            ""
          )}
        </div>
      </Box>
      <ListExperiments
        experiments={projectData.experiments}
        experimentsColumnDef={experimentsColumnDef}
        onClickAdd={() => setCreateShowDialogBox(true)}
        onClickRow={(e, id) => GotoExperiments(e, id)}
      />
    </StyledEngineProvider>
  );
}
