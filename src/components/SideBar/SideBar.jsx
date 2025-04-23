import { NavLink } from "react-router-dom";
import cibi from "../../assets/cibi.png";
import LLMIcon from "../../assets/icons/llm.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import TabularIcon from "../../assets/icons/tabular.svg?react";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="side-bar">
      <div>
        <div className="logo-ctn" style={{ display: "flex" }}>
          <img
            src={cibi}
            style={{ width: "25px", height: "25px", marginTop: "4px" }}
          ></img>
          <span className="pengywn">CIBI</span>
          {/* <CiBiLogo /> */}
        </div>
        <p
          style={{
            font: "Plus Jakarta Sans",
            color: "#6E6E88",
            marginBottom: "5px",
            marginTop: 0,
          }}
        >
          Menu
        </p>
        <NavLink to="/Dashboard" className="sidebar-tab-item">
          <TabularIcon />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tabular" className="sidebar-tab-item">
          <TabularIcon />
          <span>Tabular</span>
        </NavLink>
        <NavLink to="/llm" className="sidebar-tab-item">
          <LLMIcon />
          <span>LLM</span>
        </NavLink>
        <NavLink to="/agents" className="sidebar-tab-item">
          <TabularIcon />
          <span>Agents</span>
        </NavLink>
      </div>
      <div>
        {/* bottom */}
        <NavLink
          to="/logout"
          className="sidebar-tab-item log-out"
          style={{ background: "#3D3D52" }}
        >
          <LogoutIcon />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
}
