import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "../pages/ProjectManager/ProjectList"
import ProjectCreate from "../pages/ProjectManager/ProjectCreate"
import ProjectEdit from "../pages/ProjectManager/ProjectEdit"
import ProjectShow from "../pages/ProjectManager/ProjectShow"
import Layout from "../components/Layout"

function Main() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<ProjectList/>} />
                <Route path="/create" element={<ProjectCreate/>} />
                <Route path="/edit/:id" element={<ProjectEdit/>} />
                <Route path="/show/:id" element={<ProjectShow/>} />
            </Routes>
        </Router>
    );
}

export default Main;

if (document.getElementById('app')) {
    const rootElement = document.getElementById("app");
    const root = createRoot(rootElement);

    root.render(
        <StrictMode>
            <Main/>
        </StrictMode>
    );
}