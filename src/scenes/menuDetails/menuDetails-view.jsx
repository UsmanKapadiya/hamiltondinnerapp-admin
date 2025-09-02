import React, { useEffect, useState, useMemo } from "react";
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
import { useSelector } from "react-redux";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const MenuDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const [loading, setLoading] = useState(true);
    const [menuDetails, setMenuDetails] = useState(null);
    const itemList = useSelector((state) => state.itemState.item);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setMenuDetails(location.state);
        }
        setLoading(false);
    }, [location.state]);

    // Memoized item lookup for performance
    const itemMap = useMemo(() => {
        const map = {};
        itemList.forEach((item) => {
            map[item.id] = item.item_name;
        });
        return map;
    }, [itemList]);
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
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    bgcolor={colors.primary[400]}
                    overflow="auto"
                >
                    {/* <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Menu Name
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {menuDetails?.menu_name}
                        </Typography>
                    </Box> */}
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Date
                        </Typography>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                            {menuDetails?.date
                                ? new Date(menuDetails.date).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })
                                : ""}
                        </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: colors.gray[300] }} />
                    <Box p="10px">
                        <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                            Menu Item
                        </Typography>
                        {/* Breakfast Section */}
                        {menuDetails?.items?.breakfast?.length > 0 && (
                            <Box ml="10px" mt="15px">
                                <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                    Breakfast:
                                </Typography>
                                <Box ml="20px" mt="10px">
                                    {menuDetails.items.breakfast.map((id) => {
                                        const item = itemList.find((itm) => itm.id === id);
                                        const isDummyImage = item?.item_image === "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp";
                                        return (
                                            <Box key={id} display="flex" alignItems="center" mb={1}>
                                                {item?.item_image && !isDummyImage && (
                                                    <img
                                                        src={item.item_image}
                                                        alt={item.item_name}
                                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 12 }}
                                                    />
                                                )}
                                                <Typography color={colors.gray[100]} variant="body1">
                                                    - {item?.item_name || "Menu Item not found"}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                        {/* Lunch Section */}
                        {menuDetails?.items?.lunch?.length > 0 && (
                            <Box ml="10px" mt="15px">
                                <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                    Lunch:
                                </Typography>
                                <Box ml="20px" mt="10px">
                                    {menuDetails.items.lunch.map((id) => {
                                        const item = itemList.find((itm) => itm.id === id);
                                        const isDummyImage = item?.item_image === "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp";
                                        return (
                                            <Box key={id} display="flex" alignItems="center" mb={1}>
                                                {item?.item_image && !isDummyImage && (
                                                    <img
                                                        src={item.item_image}
                                                        alt={item.item_name}
                                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 12 }}
                                                    />
                                                )}
                                                <Typography color={colors.gray[100]} variant="body1">
                                                    - {item?.item_name || "Menu Item not found"}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                  
                        {/* Dinner Section */}
                           {menuDetails?.items?.dinner?.length > 0 && (
                            <Box ml="10px" mt="15px">
                                <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                    Dinner:
                                </Typography>
                                <Box ml="20px" mt="10px">
                                    {menuDetails.items.dinner.map((id) => {
                                        const item = itemList.find((itm) => itm.id === id);
                                        const isDummyImage = item?.item_image === "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp";
                                        return (
                                            <Box key={id} display="flex" alignItems="center" mb={1}>
                                                {item?.item_image && !isDummyImage && (
                                                    <img
                                                        src={item.item_image}
                                                        alt={item.item_name}
                                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginRight: 12 }}
                                                    />
                                                )}
                                                <Typography color={colors.gray[100]} variant="body1">
                                                    - {item?.item_name || "Menu Item not found"}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}                        
                        {/* Advanced Lunch Section */}
                        {(menuDetails?.selectedLunchItems?.lunchSoup?.length > 0 ||
                            menuDetails?.selectedLunchItems?.lunchEntree?.length > 0 ||
                            menuDetails?.selectedLunchItems?.lunchDessert?.length > 0 ||
                            menuDetails?.selectedLunchItems?.lunchAlternatives?.length > 0) && (
                                <Box ml="10px" mt="15px">
                                    <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                        Lunch:
                                    </Typography>
                                    <Box ml="20px">
                                        {menuDetails?.selectedLunchItems?.lunchSoup?.length > 0 && (
                                            <Box mt="10px">
                                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                    Lunch Soup:
                                                </Typography>
                                                <Box ml="20px" mt="10px">
                                                    {menuDetails.selectedLunchItems.lunchSoup.map((item) => (
                                                        <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                            - {item.label}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                        {menuDetails?.selectedLunchItems?.lunchEntree?.length > 0 && (
                                            <Box mt="10px">
                                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                    Lunch Entree:
                                                </Typography>
                                                <Box ml="20px" mt="10px">
                                                    {menuDetails.selectedLunchItems.lunchEntree.map((item) => (
                                                        <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                            - {item.label}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                        {menuDetails?.selectedLunchItems?.lunchDessert?.length > 0 && (
                                            <Box mt="10px">
                                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                    Lunch Dessert:
                                                </Typography>
                                                <Box ml="20px" mt="10px">
                                                    {menuDetails.selectedLunchItems.lunchDessert.map((item) => (
                                                        <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                            - {item.label}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                        {menuDetails?.selectedLunchItems?.lunchAlternatives?.length > 0 && (
                                            <Box mt="10px">
                                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                    Lunch Alternatives:
                                                </Typography>
                                                <Box ml="20px" mt="10px">
                                                    {menuDetails.selectedLunchItems.lunchAlternatives.map((item) => (
                                                        <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                            - {item.label}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default MenuDetailsView;
