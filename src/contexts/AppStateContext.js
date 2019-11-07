import React, { useState } from "react";

export const AppStateContext = React.createContext({});

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <AppStateContext.Provider value={{ state, setState }}>
      {children}
    </AppStateContext.Provider>
  );
};
