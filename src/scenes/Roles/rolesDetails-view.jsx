import React, { useEffect, useState } from "react";
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
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const RolesDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [roleDetails, setRoleDetails] = useState(null);

    useEffect(() => {
        if (location.state) {
            setRoleDetails(location.state);
        }
        setLoading(false);
    }, [location.state]);

    return (
        <Box m="20px">
            <Header
                title="Roles Detail"
                icon={<ListAltOutlined />}
                Buttons={false}
                ActionButton={true}
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
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {roleDetails?.name || "-"}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Display Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {roleDetails?.display_name || "-"}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default RolesDetailsView;
