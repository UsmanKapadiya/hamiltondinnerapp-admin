import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PersonOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import { tokens } from "../../../theme";
import { Header } from "../../../components";

import useUserView from "./useUserView";

const UserDetailsView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const { loading, userDetails } = useUserView();

  const DetailItem = ({ label, value }) => (
    <>
      <Box p="10px">
        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
          {label}
        </Typography>
        <Typography
          color={colors.gray[100]}
          variant="h5"
          fontWeight="600"
          mt="10px"
        >
          {value || "N/A"}
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: colors.gray[300] }} />
    </>
  );

  return (
    <Box m="20px">
      <Header
        title="View User Detail"
        icon={<PersonOutlined />}
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
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="auto"
        >
          <DetailItem label="Name" value={userDetails?.name} />
          <DetailItem label="User Name" value={userDetails?.user_name} />
          <DetailItem label="Email" value={userDetails?.email} />

          <DetailItem
            label="Created At"
            value={
              userDetails?.created_at
                ? dayjs(userDetails.created_at).format("YYYY-MM-DD HH:mm:ss")
                : "N/A"
            }
          />

          {/* Avatar */}
          <Box p="10px">
            <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
              Avatar
            </Typography>

            {userDetails?.avatar ? (
              <Box mt="10px">
                <img
                  src={userDetails.avatar}
                  alt="User Avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${colors.gray[300]}`,
                  }}
                />
              </Box>
            ) : (
              <Typography
                color={colors.gray[100]}
                variant="h5"
                fontWeight="600"
                mt="10px"
              >
                No Avatar Available
              </Typography>
            )}
          </Box>

          <Divider sx={{ bgcolor: colors.gray[300] }} />

          <DetailItem label="Role" value={userDetails?.role} />
        </Box>
      )}
    </Box>
  );
};

export default UserDetailsView;