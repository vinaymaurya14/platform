import { Box } from "@mui/material";
import { useParams } from 'react-router-dom';
import styles from './LLMReports.module.css';
export default function LLMReports() {
    const { projectId, experimentId, taskType } = useParams();
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "16px"
        }}>

            <div className={styles["page-title"]}>
                Reports
            </div>
            <Box className={styles["chart-ctn"]}>
                <iframe
                    src={"https://cibi.ai/cibi/grafana/d/ecddfeaf-d0de-4b10-8007-41143c53ec40/llm-valuation-and-evaluation-metrics?orgId=1&from=1705047988397&to=1705048031454&var-experiment="+experimentId+"&kiosk&refresh=5s&theme=light"}
                    width="100%"
                    height="328px"
                    style={{border: "none"}}
                />
            </Box>
            {taskType == "sft" ? (
                <Box className={styles["chart-ctn"]}>
                    <iframe
                        src={"https://cibi.ai/cibi/grafana/d/b711bbe2-1728-4234-977c-24f08947e994/model-metrics-llm?orgId=1&var-experiment="+experimentId+"&kiosk&theme=light&panelId=5"}
                        width="100%"
                        height="328px"
                        style={{border: "none"}}
                    />
                </Box>
            ):null}
            
        </div>

    )
}