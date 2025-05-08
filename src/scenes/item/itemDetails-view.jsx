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

const ItemDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    const location = useLocation();
    const categoryListData = location.state?.categoryListData || [];
    const optionsListData = location.state?.optionsList || [];
    const peferencesListData = location.state?.peferencesList || [];

    const [itemDetails, setItemDetails] = useState('')
    const [loading, setLoading] = useState(false);
    const itemId = location.state.id

    useEffect(() => {
        getItemsDetails(itemId)
    }, [itemId])

    const getItemsDetails = async (id) => {
        try {
            setLoading(true);
            const response = await ItemServices.getItemsDetails(id);
            // console.log(response?.data)
            setItemDetails(response?.data);

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
                            {itemDetails?.item_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Item Chinese Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {itemDetails?.item_chinese_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Category
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {(() => {
                                const typeId = itemDetails?.cat_id;
                                const typeObj = categoryListData.find((t) => t.id === typeId);
                                return typeObj ? typeObj.cat_name : "N/A";
                            })()}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Is Allday
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {itemDetails?.is_allday ? itemDetails?.is_allday : 0}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Item Image
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {itemDetails?.image}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Options
                        </Typography>
                        {/* <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {Options.find((option) => option.value === itemDetails?.options)?.label || "N/A"}
                    </Typography> */}
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {(() => {
                                try {
                                    const optionIds = JSON.parse(itemDetails?.options || "[]");
                                    const optionNames = optionIds
                                        .map((id) => {
                                            const option = optionsListData.find((opt) => opt.id === parseInt(id));
                                            return option ? option.option_name : null;
                                        })
                                        .filter(Boolean);
                                    return optionNames.length > 0 ? optionNames.join(", ") : "N/A";
                                } catch (error) {
                                    console.error("Error parsing options:", error);
                                    return "N/A";
                                }
                            })()}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Preference
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {(() => {
                                try {
                                    const opeferenceIds = JSON.parse(itemDetails?.preference || "[]");
                                    const opeferenceNames = opeferenceIds
                                        .map((id) => {
                                            const opeference = peferencesListData.find((opt) => opt.id === parseInt(id));
                                            return opeference ? opeference.pname : null;
                                        })
                                        .filter(Boolean);
                                    return opeferenceNames.length > 0 ? opeferenceNames.join(", ") : "N/A";
                                } catch (error) {
                                    console.error("Error parsing options:", error);
                                    return "N/A";
                                }
                            })()}
                        </Typography>
                    </Box>

                </Box>
            )}
        </Box>
    );
};

export default ItemDetailsView;
