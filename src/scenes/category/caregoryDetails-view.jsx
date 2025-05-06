import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
    CircularProgress
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
    const [categoryDetails, setCategoryDetails] = useState('')
    const [loading, setLoading] = useState(false);
    // console.log(location)
    let categoryId = location.state.id
    let categoryListData = location.state.categoryListData

    // const categoryDetails = location.state;
    useEffect(() => {
        getCategoryDetails(categoryId)
    }, [categoryId])

    const getCategoryDetails = async (id) => {
        try {
            setLoading(true);
            const response = await CategoryServices.getCategoryDetails(id);
            setCategoryDetails(response?.data);

        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header
                title="Room Details View"
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
                            Category Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {categoryDetails?.cat_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Category Chinese Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {categoryDetails?.category_chinese_name}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Type
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {(() => {
                                const typeId = categoryDetails?.type;
                                const typeObj = type.find((t) => t.id === typeId);
                                return typeObj ? typeObj.type_name : "N/A";
                            })()}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Parent Id
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {(() => {
                                const parentId = categoryDetails?.parent_id;
                                const parentObj = categoryListData.find((t) => t.id === parentId);
                                return parentObj ? parentObj.cat_name : "No results"; { categoryDetails?.parent_id }
                            })()}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />

                </Box>
            )}
        </Box>
    );
};

export default CategoryDetailsView;
