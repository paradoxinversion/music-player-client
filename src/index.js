import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "unstated";
import "./style.css";
var mountNode = document.getElementById("app");
ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  mountNode
);
