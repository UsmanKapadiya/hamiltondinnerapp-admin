import {
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Header } from "../../components";

import { tokens } from "../../theme";

import useDashboard from "./useDashboard";

const Dashboard = () => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const isXlDevices =
    useMediaQuery("(min-width:1260px)");

  const isMdDevices =
    useMediaQuery("(min-width:724px)");

  const isXsDevices =
    useMediaQuery("(max-width:436px)");

  const {
    loading,
    itemListData,
  } = useDashboard();

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Header
          title="DASHBOARD"
          subtitle="Welcome to your dashboard"
        />
      </Box>

      {/* Future Dashboard Widgets */}

      {/*
        All charts/cards/statistics UI can stay here.
        API/business logic remains inside useDashboard.js
      */}
    </Box>
  );
};

export default Dashboard;
