import React, { useEffect, useState } from "react";
import {
    Box,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { PersonOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import UserServices from "../../services/userServices";
import dayjs from "dayjs";

const UserDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    const location = useLocation();
    const [UserDetails, setUserDetails] = useState('')
    const [loading, setLoading] = useState(false);
    const UserId = location.state.id

    useEffect(() => {
        getUsersDetails(UserId)
    }, [UserId])

    const getUsersDetails = async (id) => {
        try {
            setLoading(true);
            const response = await UserServices.getUserDetails(id);
            setUserDetails(response?.data);
        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header
                title="User Details View"
                icon={<PersonOutlined />}
                Buttons={false}
                ActionButton={true}
            />
            {loading ? (

                <Box
                    display="flex"
                    justifyContent="center"
                    alignUsers="center"
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
                            Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            User Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.user_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Email
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.email}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Created At
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.created_at ? dayjs(UserDetails.created_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    {/* Remove  Email Verified At*/}
                    {/* <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Email Verified At
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.email_varified_at ? dayjs(UserDetails.email_varified_at).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                        </Typography>
                    </Box> */}
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Avtar
                        </Typography>
                        {UserDetails?.avatar ? (
                            <Box mt="10px" display="flex" justifyContent="flex-start" textAlign="flex-start">
                                <img
                                    src={UserDetails?.avatar}
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
                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                                No Avatar Available
                            </Typography>
                        )}
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Role
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {UserDetails?.role}
                        </Typography>
                    </Box>

                </Box>
            )}
        </Box>
    );
};

export default UserDetailsView;
