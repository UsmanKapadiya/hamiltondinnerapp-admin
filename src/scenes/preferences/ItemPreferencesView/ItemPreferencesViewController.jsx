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
import useItemPreferencesView from "./useItemPreferencesView";

const ItemPreferencesView = () => {
  const theme = useTheme();

  const colors = tokens(
    theme.palette.mode
  );

  const isXlDevices = useMediaQuery(
    "(min-width: 1260px)"
  );

  const {
    loading,
    preferencesDetails,
  } = useItemPreferencesView();

  return (
    <Box m="20px">
      <Header
        title="View Menu Item Preference"
        icon={<ListAltOutlined />}
        Buttons={false}
        ActionButton
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
          gridColumn={
            isXlDevices
              ? "span 4"
              : "span 3"
          }
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
              Preference Name
            </Typography>

            <Typography
              color={colors.gray[100]}
              variant="h5"
              fontWeight="600"
              mt="10px"
            >
              {preferencesDetails?.pname ||
                "-"}
            </Typography>
          </Box>

          <Divider
            sx={{
              bgcolor: colors.gray[300],
            }}
          />

          {preferencesDetails?.pname_cn && (
            <>
              <Box p="10px">
                <Typography
                  color={colors.gray[100]}
                  variant="h3"
                  fontWeight="600"
                >
                  Preference Chinese Name
                </Typography>

                <Typography
                  color={colors.gray[100]}
                  variant="h5"
                  fontWeight="600"
                  mt="10px"
                >
                  {preferencesDetails?.pname_cn ||
                    "-"}
                </Typography>
              </Box>

              <Divider
                sx={{
                  bgcolor:
                    colors.gray[300],
                }}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ItemPreferencesView;