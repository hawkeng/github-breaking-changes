import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import apolloClient from "./apollo-client";
import "./App.css";
import ReleaseForm from "./components/ReleaseForm";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="spaced container">
        <h1 className="title is-1">Check breaking changes between versions</h1>
        <ReleaseForm />
      </div>
    </ApolloProvider>
  );
}

export default App;
