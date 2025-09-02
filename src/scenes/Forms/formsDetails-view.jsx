import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { DynamicFormOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import FormServices from "../../services/formServices";

const FormsDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const [formsDetails, setFormsDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const itemformsDetails = location.state;

    const getFormsDetails = useCallback(async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await FormServices.getFormDetails(id);
            setFormsDetails(response?.data);
        } catch (error) {
            console.error("Error fetching forms list:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getFormsDetails(itemformsDetails?.id);
    }, [getFormsDetails, itemformsDetails?.id]);


    return (
        <Box m="20px">
            <Header
                title="View Form Type"
                icon={<DynamicFormOutlined />}
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
                            Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {formsDetails?.name || "N/A"}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Allow Print
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {formsDetails?.allow_print ? "Yes" : "No"}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Allow Mail
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {formsDetails?.allow_mail ? "Yes" : "No"}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default FormsDetailsView;