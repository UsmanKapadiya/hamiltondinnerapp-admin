import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ListAltOutlined } from "@mui/icons-material";

import Header from "../../../components/Header";
import { tokens } from "../../../theme";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";

import useRoleView from "./useRoleView";

const RolesDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const { loading, roleDetails } = useRoleView();

  return (
    <Box m="20px">
      <Header
        title="View Role"
        icon={<ListAltOutlined />}
        Buttons={false}
        ActionButton
      />

      {loading ? (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={9999}
        >
          <CustomLoadingOverlay />
        </Box>
      ) : (
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
        >
          <Box p="10px">
            <Typography
              color={colors.gray[100]}
              variant="h3"
              fontWeight="600"
            >
              Name
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {roleDetails?.name || "-"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RolesDetailsView;
