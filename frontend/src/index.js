import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import Network from "react-vis-network-graph";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// import "./network.css";
//import nodeData from "./data.json";
import writerImg from './images/writer2.png';
import documentImg from './images/file.png';
import mockData from './data-mock/no-date.json';
import App from './App' 
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);


