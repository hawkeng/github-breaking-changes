import React from "react";
import "./App.css";
import ReleaseForm from "./components/ReleaseForm";
import BreakingChangesTable from "./components/BreakingChangesTable";
import { AppStateProvider } from "./contexts/AppStateContext";

function App() {
  return (
    <AppStateProvider>
      <div className="spaced container">
        <h1 className="title is-1">Check breaking changes between versions</h1>
        <ReleaseForm />
        <BreakingChangesTable />
      </div>
    </AppStateProvider>
  );
}

export default App;
