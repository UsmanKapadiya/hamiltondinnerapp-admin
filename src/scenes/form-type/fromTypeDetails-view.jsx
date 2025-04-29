import React from "react";
import {
    Box,
    Button,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { ListAltOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";

const FormTypeDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const location = useLocation();
  const fromTypeDetails = location.state;


  return (
    <Box m="20px">
      <Header
        title="FormType Details View"
        icon={<ListAltOutlined />}
        Buttons={false}
        ActionButton={true}
      />
      <Box
        gridColumn={isXlDevices ? "span 4" : "span 3"}
        gridRow="span 2"
        bgcolor={colors.primary[400]}
        overflow="auto"
      >
        <Box p="10px">
          <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
            FormType Name
          </Typography>
          <Typography
            color={colors.gray[100]}
            variant="h5"
            fontWeight="600"
            mt="10px"
          >
            {fromTypeDetails?.FormTypeName}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: colors.gray[300] }} />
        <Box p="10px">
          <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
            Allow Print
          </Typography>
          <Typography
            color={colors.gray[100]}
            variant="h5"
            fontWeight="600"
            mt="10px"
          >
            {fromTypeDetails?.AllowPrint}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: colors.gray[300] }} />
        <Box p="10px">
          <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
            Allow Mail
          </Typography>
          <Typography
            color={colors.gray[100]}
            variant="h5"
            fontWeight="600"
            mt="10px"
          >
            {fromTypeDetails?.AllowMail}
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: colors.gray[300] }} />
      </Box>
    </Box>
  );
};

export default FormTypeDetailsView;
