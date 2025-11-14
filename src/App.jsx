import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const ToggledContext = createContext(null);
export const CollapsedContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const values = { toggled, setToggled };
  const collapsedValues = { collapsed, setCollapsed };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <CollapsedContext.Provider value={collapsedValues}>
            <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
              <SideBar />
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "100%",
                }}
              >
                <Navbar />
                <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </CollapsedContext.Provider>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
