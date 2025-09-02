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
import CategoryServices from "../../services/categoryServices";
import { type } from "../../data/mockData";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const CategoryDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const location = useLocation();
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const categoryId = location.state?.id;
    const categoryListData = location.state?.categoryListData || [];

    useEffect(() => {
        if (categoryId) {
            getCategoryDetails(categoryId);
        }
    }, [categoryId]);

    const getCategoryDetails = async (id) => {
        setLoading(true);
        try {
            const response = await CategoryServices.getCategoryDetails(id);
            setCategoryDetails(response?.data || null);
        } catch (error) {
            setCategoryDetails(null);
            console.error("Error fetching Course details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeName = (typeId) => {
        const typeObj = type.find((t) => t.id == typeId);
        return typeObj ? typeObj.type_name : "N/A";
    };

    const getParentName = (parentId) => {
        const parentObj = categoryListData.find((t) => t.id == parentId);
        return parentObj ? parentObj.cat_name : "";
    };

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