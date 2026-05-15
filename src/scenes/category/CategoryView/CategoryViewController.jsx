import React from "react";

import {
    Box,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { ListAltOutlined } from "@mui/icons-material";
import Header from "../../../components/Header";
import { tokens } from "../../../theme";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useCategoryDetailsView from "./useCategoryDetailsView";
import { type } from "../../../data/mockData";


const getTypeName = (typeId) => {
    const typeObj = type.find((t) => t.id == typeId);

    return typeObj
        ? typeObj.type_name
        : "N/A";
};

const getParentName = (
    parentId,
    categoryListData
) => {
    const parentObj =
        categoryListData.find(
            (t) => t.id == parentId
        );

    return parentObj
        ? parentObj.cat_name
        : "";
};


const CategoryDetailsView = () => {
    const theme = useTheme();

    const colors = tokens(
        theme.palette.mode
    );

    const isXlDevices =
        useMediaQuery(
            "(min-width: 1260px)"
        );

    const {
        categoryDetails,
        categoryListData,
        loading,
    } = useCategoryDetailsView();

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
                    gridColumn={
                        isXlDevices
                            ? "span 4"
                            : "span 3"
                    }
                    gridRow="span 2"
                    bgcolor={
                        colors.primary[400]
                    }
                    overflow="auto"
                >
                    <Box p="10px">
                        <Typography
                            color={colors.gray[100]}
                            variant="h3"
                            fontWeight="600"
                        >
                            Course Name
                        </Typography>

                        <Typography
                            color={colors.gray[100]}
                            variant="h5"
                            fontWeight="600"
                            mt="10px"
                        >
                            {categoryDetails?.cat_name ||
                                "N/A"}
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            bgcolor:
                                colors.gray[300],
                        }}
                    />

                    {categoryDetails?.category_chinese_name && (
                        <>
                            <Box p="10px">
                                <Typography
                                    color={
                                        colors.gray[100]
                                    }
                                    variant="h3"
                                    fontWeight="600"
                                >
                                    Course Chinese Name
                                </Typography>

                                <Typography
                                    color={
                                        colors.gray[100]
                                    }
                                    variant="h5"
                                    fontWeight="600"
                                    mt="10px"
                                >
                                    {
                                        categoryDetails?.category_chinese_name
                                    }
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    bgcolor:
                                        colors.gray[300],
                                }}
                            />
                        </>
                    )}

                    <Box p="10px">
                        <Typography
                            color={colors.gray[100]}
                            variant="h3"
                            fontWeight="600"
                        >
                            Meal Type
                        </Typography>

                        <Typography
                            color={colors.gray[100]}
                            variant="h5"
                            fontWeight="600"
                            mt="10px"
                        >
                            {getTypeName(
                                categoryDetails?.type
                            )}
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            bgcolor:
                                colors.gray[300],
                        }}
                    />

                    {getParentName(
                        categoryDetails?.parent_id,
                        categoryListData
                    ) && (
                            <>
                                <Box p="10px">
                                    <Typography
                                        color={
                                            colors.gray[100]
                                        }
                                        variant="h3"
                                        fontWeight="600"
                                    >
                                        Parent Course
                                    </Typography>

                                    <Typography
                                        color={
                                            colors.gray[100]
                                        }
                                        variant="h5"
                                        fontWeight="600"
                                        mt="10px"
                                    >
                                        {getParentName(
                                            categoryDetails?.parent_id,
                                            categoryListData
                                        )}
                                    </Typography>
                                </Box>

                                <Divider
                                    sx={{
                                        bgcolor:
                                            colors.gray[300],
                                    }}
                                />
                            </>
                        )}
                </Box>
            )}
        </Box>
    );
};

export default CategoryDetailsView;
