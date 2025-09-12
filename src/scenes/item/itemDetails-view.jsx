import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { ListAltOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const ItemDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const location = useLocation();
  const categoryListData = location.state?.categoryListData || [];
  const optionsListData = location.state?.optionsList || [];
  const preferencesListData = location.state?.preferencesList || [];

  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemId = location.state?.id;

  useEffect(() => {
    if (itemId) {
      getItemsDetails(itemId);
    }
  }, [itemId]);

  const getItemsDetails = async (id) => {
    setLoading(true);
    try {
      const response = await ItemServices.getItemsDetails(id);
      setItemDetails(response?.data || null);
    } catch (error) {
      console.error("Error fetching item details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized display values for options and preferences
  const optionNames = useMemo(() => {
    if (!itemDetails?.options) return "";
    try {
      const optionIds = JSON.parse(itemDetails.options);
      const names = optionIds
        .map((id) => {
          const option = optionsListData.find((opt) => opt.id === parseInt(id));
          return option ? option.option_name : null;
        })
        .filter(Boolean);
      return names.length > 0 ? names.join(", ") : "";
    } catch {
      return "";
    }
  }, [itemDetails, optionsListData]);

  const preferenceNames = useMemo(() => {
    if (!itemDetails?.preference) return "";
    try {
      const prefIds = JSON.parse(itemDetails.preference);
      const names = prefIds
        .map((id) => {
          const pref = preferencesListData.find((p) => p.id === parseInt(id));
          return pref ? pref.pname : null;
        })
        .filter(Boolean);
      return names.length > 0 ? names.join(", ") : "";
    } catch {
      return "";
    }
  }, [itemDetails, preferencesListData]);

  return (
    <Box m="20px">
      <Header
        title="View Menu Item Detail"
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
              Menu Item Name
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {itemDetails?.item_name || ""}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          {itemDetails?.item_chinese_name && (
            <>
              <Box p="10px">
                <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                  Menu Item Chinese Name
                </Typography>
                <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                  {itemDetails?.item_chinese_name || ""}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Course
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {(() => {
                const typeId = itemDetails?.cat_id;
                const typeObj = categoryListData.find((t) => t.id === typeId);
                return typeObj ? typeObj.cat_name : "";
              })()}
            </Typography>
          </Box>
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          {/* <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Is Allday
            </Typography>
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
              {itemDetails?.is_allday ? "Yes" : "No"}
            </Typography>
          </Box> */}
          <Divider sx={{ bgcolor: colors.gray[300] }} />
          {itemDetails?.item_image && (
            <>
              <Box p="10px">
                <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                  Menu Item Image
                </Typography>
                <img
                  src={itemDetails.item_image}
                  alt="Item"
                  style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: 8, marginTop: 8 }}
                />

              </Box>
              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          {optionNames && (
            <>
              <Box p="10px">
                <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                  Options
                </Typography>
                <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                  {optionNames}
                </Typography>
              </Box>
              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}
          {preferenceNames && (
            <Box p="10px">
              <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                Preference
              </Typography>
              <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                {preferenceNames}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ItemDetailsView;