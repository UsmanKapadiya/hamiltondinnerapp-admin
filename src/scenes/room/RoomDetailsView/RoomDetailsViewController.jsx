import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ListAltOutlined } from "@mui/icons-material";

import Header from "../../../components/Header";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";

import { tokens } from "../../../theme";

import useRoomDetailsView from "./useRoomDetailsView";

const RoomDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const { loading, roomDetails, getLanguageLabel } =
    useRoomDetailsView();

  return (
    <Box m="20px">
      <Header
        title="View Resident Detail"
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
              Unit Number
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {roomDetails?.room_name || "-"}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          <Box p="10px">
            <Typography
              color={colors.gray[100]}
              variant="h3"
              fontWeight="600"
            >
              Resident Name
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {roomDetails?.resident_name || "-"}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          <Box p="10px">
            <Typography
              color={colors.gray[100]}
              variant="h3"
              fontWeight="600"
            >
              Occupancy
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {roomDetails?.occupancy ?? "-"}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          <Box p="10px">
            <Typography
              color={colors.gray[100]}
              variant="h3"
              fontWeight="600"
            >
              Language Preference
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {getLanguageLabel(roomDetails?.language)}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          {roomDetails?.food_texture && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Food Texture
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {roomDetails?.food_texture || "-"}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          {roomDetails?.special_instrucations && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Special Instructions
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {roomDetails?.special_instrucations || "-"}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          {roomDetails?.allergy_info && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Allergy Information
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {roomDetails?.allergy_info || "-"}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          <Box p="10px">
            <Typography
              color={colors.gray[100]}
              variant="h3"
              fontWeight="600"
            >
              Status
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {roomDetails?.is_active === 1 ||
              roomDetails?.is_active === true
                ? "Active"
                : "Inactive"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDetailsView;
