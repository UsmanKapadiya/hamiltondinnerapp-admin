import React from "react";
import {
    Box,
    Divider,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { Header } from "../../components";
import { ListAltOutlined } from "@mui/icons-material";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const CategoryDetailsView = ({ colors, categoryDetails, loading, getTypeName, getParentName }) => {
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    return (
        <Box m="20px">
            <Header
                title="View Course Detail"
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
                            Course Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {categoryDetails?.cat_name || "N/A"}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    {categoryDetails?.category_chinese_name && (
                        <>
                            <Box p="10px">
                                <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                                    Course Chinese Name
                                </Typography>
                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                                    {categoryDetails?.category_chinese_name || ""}
                                </Typography>
                            </Box>
                            <Divider sx={{ bgcolor: colors.gray[300] }} />
                        </>
                    )}
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Meal Type
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {getTypeName(categoryDetails?.type)}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    {getParentName(categoryDetails?.parent_id) && (
                        <>
                            <Box p="10px">
                                <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                                    Parent Course
                                </Typography>
                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                                    {getParentName(categoryDetails?.parent_id)}
                                </Typography>
                            </Box>
                            <Divider sx={{ bgcolor: colors.gray[300] }} />
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default CategoryDetailsView;