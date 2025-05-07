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
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const ItemOptionsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const [optionsDetails, setOptionsDetails] = useState('')
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const ItemoptionsDetails = location.state;


    useEffect(() => {
        getOptionsDetails(ItemoptionsDetails?.id)
    }, [location.state])

    const getOptionsDetails = async (id) => {
        try {
            setLoading(true);
            const response = await ItemServices.getOptionDetails(id);
            // console.log(response?.data)
            setOptionsDetails(response?.data);
        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header
                title="Item Details View"
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
                            Item Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {optionsDetails?.option_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Item Chinese Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {optionsDetails?.option_name_cn}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />

                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Is Paid Item
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {optionsDetails?.is_paid_item}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ItemOptionsView;
