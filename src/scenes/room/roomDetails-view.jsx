import React, { useEffect, useState, useCallback } from "react";
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
import RoomServices from "../../services/roomServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const RoomDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [roomDetails, setRoomDetails] = useState(null);

  const getRoomsDetails = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await RoomServices.getRoomDetails(id);
      setRoomDetails(response?.data || {});
    } catch (error) {
      setRoomDetails({});
      console.error("Error fetching room details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRoomsDetails(location.state?.id);
  }, [location.state, getRoomsDetails]);

  // Helper for language display
  const getLanguageLabel = (lang) => {
    if (lang === "1" || lang === 1) return "English";
    if (lang === "0" || lang === 0) return "Chinese";
    return lang || "-";
  };

  return (
    <Box m="20px">
      <Header
        title="Room Details View"
        icon={<ListAltOutlined />}
        Buttons={false}
        ActionButton={true}
      />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 100px)"
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
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Unit Number
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {roomDetails?.room_name || "-"}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Resident Name
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {roomDetails?.resident_name || "-"}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Occupancy
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {roomDetails?.occupancy ?? "-"}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Language Preference
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {getLanguageLabel(roomDetails?.language)}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Food Texture
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {roomDetails?.food_texture || "-"}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Special Instructions
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {roomDetails?.special_instrucations || "-"}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600" mb="10px">
              Active
            </Typography>
            <Button
              variant="contained"
              color={roomDetails?.is_active === "1" || roomDetails?.is_active === true ? "info" : "inherit"}
              size="small"
              sx={{ mt: "10px" }}
            >
              {roomDetails?.is_active === "1" || roomDetails?.is_active === true ? "Active" : "Inactive"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDetailsView;