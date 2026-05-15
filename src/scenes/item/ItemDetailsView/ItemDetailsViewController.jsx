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
import useItemDetailsView from "./useItemDetailsView";

const ItemDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const {
    loading,
    itemDetails,
    courseName,
    optionNames,
    preferenceNames,
  } = useItemDetailsView();

  return (
    <Box m="20px">
      <Header
        title="View Menu Item Detail"
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
              Menu Item Name
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {itemDetails?.item_name || "-"}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          {itemDetails?.item_chinese_name && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Menu Item Chinese Name
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {itemDetails?.item_chinese_name || "-"}
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
              Course
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {courseName || "-"}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          {itemDetails?.item_image && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Menu Item Image
                </Typography>

                <img
                  src={itemDetails?.item_image}
                  alt="Item"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              </Box>

              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          {optionNames && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Options
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {optionNames}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: colors.gray[300] }} />
            </>
          )}

          {preferenceNames && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Preference
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {preferenceNames}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ItemDetailsView;
