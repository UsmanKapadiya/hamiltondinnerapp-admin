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
import useMenuDetailsView from "./useMenuDetailsView";
import {
    formatDate,
    renderMenuSection,
    renderAdvancedSection,
} from "./menuDetailsView.utils";

const MenuDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const {
        loading,
        menuDetails,
        itemList,
    } = useMenuDetailsView();

    return (
        <Box m="20px">
            <Header
                title="View Menu Detail"
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
                    <Divider
                        sx={{
                            bgcolor:
                                colors.gray[300],
                        }}
                    />

                    {/* Date */}
                    <Box p="10px">
                        <Typography
                            color={
                                colors.gray[100]
                            }
                            variant="h3"
                            fontWeight="600"
                        >
                            Date
                        </Typography>

                        <Typography
                            color={
                                colors.gray[100]
                            }
                            variant="h5"
                            fontWeight="600"
                            mt="10px"
                        >
                            {formatDate(
                                menuDetails?.date
                            )}
                        </Typography>
                    </Box>

                    <Divider
                        sx={{
                            bgcolor:
                                colors.gray[300],
                        }}
                    />

                    {/* Menu Items */}
                    <Box p="10px">
                        <Typography
                            color={
                                colors.gray[100]
                            }
                            variant="h3"
                            fontWeight="600"
                        >
                            Menu Item
                        </Typography>

                        {renderMenuSection({
                            title: "Breakfast",
                            items:
                                menuDetails?.items
                                    ?.breakfast,
                            itemList,
                            colors,
                        })}

                        {renderMenuSection({
                            title: "Lunch",
                            items:
                                menuDetails?.items
                                    ?.lunch,
                            itemList,
                            colors,
                        })}

                        {renderMenuSection({
                            title: "Dinner",
                            items:
                                menuDetails?.items
                                    ?.dinner,
                            itemList,
                            colors,
                        })}

                        {renderAdvancedSection({
                            selectedLunchItems:
                                menuDetails?.selectedLunchItems,
                            colors,
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default MenuDetailsView;
