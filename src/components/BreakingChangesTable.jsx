import React, { useContext } from "react";
import AppStateContext from "../contexts/AppStateContext";

const BreakingChangesList = () => {
  const { state: appState } = useContext(AppStateContext);
};

export default BreakingChangesList;
