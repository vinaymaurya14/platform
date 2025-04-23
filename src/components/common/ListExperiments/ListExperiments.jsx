import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Select, StyledEngineProvider, MenuItem } from "@mui/material";
import styles from "./ListExperiments.module.css";
import FilterIcon from "../../../assets/icons/filter.svg?react";
import NoDataImageUrl from "../../../assets/images/nodata.svg?url";
import PlusCircleIcon from "../../../assets/icons/pluscircle.svg?react";
import CustomPagination from "../CustomPagination/CustomPagination";
export default function ListExperiments({
  experiments,
  onClickAdd,
  experimentsColumnDef,
  onClickRow,
}) {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [statusFilterOptions, setStatusFilterOptions] = useState([]);
  const [filteredProjectData, setFilteredProjectData] = useState(experiments);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const populateFilter = (experiments) => {
    let temp = [];
    experiments.forEach((exp) => {
      if (!temp.includes(exp.status)) {
        temp.push(exp.status);
      }
    });
    setStatusFilterOptions(temp);
  };

  useEffect(() => {
    if (statusFilter === "") {
      setFilteredProjectData(experiments);
    } else {
      setFilteredProjectData(
        experiments.filter((exp) => exp.status === statusFilter)
      );
    }
  }, [statusFilter, experiments]);

  useEffect(() => {
    populateFilter(experiments);
  }, [experiments]);

  return (
    <div style={{ padding: "0px 24px 24px 24px" }}>
      {experiments.length == 0 ? (
        <div className={styles["no-data-ctn"]}>
          <img src={NoDataImageUrl} widtt="336"></img>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span className={styles["no-data-label"]}>
              No Experiments Available
            </span>
            <span className={styles["no-data-sub-label"]}>
              Currently, there is not experiment to display. Please add new
              experiment by clicking below icon.
            </span>
          </Box>
          <button
            style={{
              display: "flex",
              gap: "5px",
            }}
            className="gradient-background"
            onClick={onClickAdd}
          >
            <PlusCircleIcon />
            <span>Add Experiment</span>
          </button>
        </div>
      ) : (
        <Box sx={{ width: "100%", height: "auto" }}>
          <div className={styles["table-title-ctn"]}>
            <span className={styles["table-title"]}>List of Experiments</span>
            <button
              className={styles["table-title-action-btn"]}
              onClick={() => setOpen(!open)}
            >
              <FilterIcon style={{ marginRight: "10px" }} />
              <span>
                Filter By Status {statusFilter != "" ? ": " + statusFilter : ""}
              </span>
              <Select
                className={styles["hidden-select"]}
                sx={{
                  boxShadow: "none",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                }}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
              >
                <MenuItem value="">All</MenuItem>
                {statusFilterOptions.map((option) => (
                  <MenuItem value={option} key={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </button>
          </div>

          <StyledEngineProvider injectFirst>
            {filteredProjectData.length != 0 ? (
              <DataGrid
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  // border:"none",
                  // borderBottom:"none",
                  "& .MuiDataGrid-columnHeaders": {
                    background: " #1F1F29",
                    height: "53px",
                    color: "white",
                    textTransform: "capitalize",
                    stroke: "white",
                    fill: "white",
                    borderRadius: 0,
                  },
                  ".MuiDataGrid-columnSeparator.MuiDataGrid-columnSeparator--sideRight":
                    {
                      display: "none",
                    },
                  ".MuiDataGrid-root .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                  ".MuiDataGrid-footerContainer": {
                    border: "0px",
                  },
                  ".MuiDataGrid-row:nth-child(even)": {
                    background: "white",
                  },
                }}
                rows={filteredProjectData}
                columns={experimentsColumnDef}
                getRowId={(row) => row.exp_id}
                pagination
                slots={{
                  pagination: CustomPagination,
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                // pageSizeOptions={[5]}
                disableColumnMenu
                disableRowSelectionOnClick
                
                onRowClick={onClickRow}
              />
            ) : null}
          </StyledEngineProvider>
        </Box>
      )}
    </div>
  );
}
