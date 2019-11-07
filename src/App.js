import React from "react";
// import { ApolloProvider } from "@apollo/react-hooks";
import "./App.css";
// import apolloClient from "./apollo-client";
import ReleaseForm from "./components/ReleaseForm";
import { AppStateProvider } from "./contexts/AppStateContext";

function App() {
  return (
    // <ApolloProvider client={apolloClient}>
    <AppStateProvider>
      <div className="spaced container">
        <h1 className="title is-1">Check breaking changes between versions</h1>
        <ReleaseForm />
      </div>
    </AppStateProvider>
    // </ApolloProvider>
  );
}

export default App;
