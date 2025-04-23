import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import { Dashboard } from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import LLM from "./components/LLM/LLM";
import LLMExperiment from "./components/LLM/LLMExperiment/LLMExperiment";
import { default as LLMProject } from "./components/LLM/Project/Project";
import Login from "./components/Login/Login";
import LoginRes from "./components/Login/LoginRes";
import { Logout } from "./components/Logout/Logout";
import SideBar from "./components/SideBar/SideBar";
import Experiment from "./components/Tabular/Experiment/Experiment";
import Project from "./components/Tabular/Project/Project";
import Tabular from "./components/Tabular/Tabular";
import Agents from "./components/Agents/Agents";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  const updateToken = (value) => {
    sessionStorage.setItem("token", value);
    setToken(value);
  };

  const logout = () => {
    updateToken(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  return (
    <div style={{ height: "100%", display: "flex", width: "100%" }}>
      {sessionStorage.getItem("token") &&
        sessionStorage.getItem("token") != "" && <SideBar></SideBar>}
      <div style={{ flex: "100%" }}>
        {sessionStorage.getItem("token") &&
          sessionStorage.getItem("token") != "" && <Header></Header>}
        <div
          className="page-root"
          style={
            sessionStorage.getItem("token")
              ? {
                  width: "calc(100vw - 110px)",
                  height: "calc(100vh - 61px)",
                  overflowY: "scroll",
                  background: "#F6F6FF",
                }
              : { background: "#F6F6FF" }
          }
        >
          <Routes>
            {sessionStorage.getItem("token") &&
            sessionStorage.getItem("token") != "" ? (
              <Route path="/" element={<Tabular />} />
            ) : (
              <Route path="/" element={<Login updateToken={updateToken} />} />
            )}
            <Route path="/tabular" element={<Tabular />} />
            <Route path="/tabular/:projectId" element={<Project />} />
            <Route
              path="/tabular/:projectId/Experiment/:experimentId/*"
              element={<Experiment />}
            />
            <Route
              path="/llm/:projectId/Experiment/:experimentId/*"
              element={<LLMExperiment />}
            />

            <Route path="/cv" element={<div>CV</div>} />
            <Route path="/nlp" element={<div>NLP</div>} />
            <Route path="/llm" element={<LLM />} />
            <Route path="/llm/:projectId" element={<LLMProject />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/logout" element={<Logout logout={logout} />} />
            <Route
              path="/login"
              element={<Login updateToken={updateToken} />}
            />
            <Route
              path="/callback"
              element={<LoginRes token={token} updateToken={updateToken} />}
            />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
