import React from "react";
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

const ItemPreferencesView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    const location = useLocation();
    const ItemPreferencesDetails = location.state;
    console.log("ItemPreferencesDetails",ItemPreferencesDetails   )

    return (
        <Box m="20px">
            <Header
                title="Item Details View"
                icon={<ListAltOutlined />}
                Buttons={false}
                ActionButton={true}
            />
            <Box
                gridColumn={isXlDevices ? "span 4" : "span 3"}
                gridRow="span 2"
                bgcolor={colors.primary[400]}
                overflow="auto"
            >
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                    Preference name
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {ItemPreferencesDetails?.preferencesName}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                        Item Chinese Name
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {ItemPreferencesDetails?.preferencesChineseName}
                    </Typography>
                </Box>            
            </Box>
        </Box>
    );
};

export default ItemPreferencesView;
