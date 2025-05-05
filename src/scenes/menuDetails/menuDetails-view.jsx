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
import { useSelector } from "react-redux";

const MenuDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    // const dispatch = useDispatch();
    const itemList = useSelector((state) => state.itemState.item);
    console.log("fetch Redux Data", itemList)
    const location = useLocation();
    const menuDetails = location.state;
    console.log("menuDetails", menuDetails)

    return (
        <Box m="20px">
            <Header
                title="Viewing Menu Detail"
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
                        Menu Name
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {menuDetails?.menu_name}
                    </Typography>
                </Box>
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
                        Item
                    </Typography>

                    {/* Breakfast Section */}
                    {menuDetails?.items?.breakfast?.length > 0 && (
                        <Box ml="10px" mt="15px">
                            <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                Breakfast:
                            </Typography>
                            <Box ml="20px" mt="10px">
                                {menuDetails.items.breakfast.map((id) => {
                                    const item = itemList.find((item) => item.id === id); // Find the item in itemList by ID
                                    console.log("item", item)
                                    return (
                                        <Typography key={id} color={colors.gray[100]} variant="body1">
                                            - {item ? item?.item_name : "Item not found"} {/* Display item name or fallback */}
                                        </Typography>
                                    );
                                })}
                            </Box>
                            {/* <Box ml="20px">
                                    {menuDetails?.selectedBreakfastItems?.dailySpecial?.length > 0 && (
                                        <Box mt="10px">
                                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                Daily Special:
                                            </Typography>
                                            <Box ml="20px" mt="10px">
                                                {menuDetails?.selectedBreakfastItems?.dailySpecial?.map((item) => (
                                                    <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                        - {item.label}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                    {menuDetails?.selectedBreakfastItems?.alternatives?.length > 0 && (
                                        <Box mt="10px">
                                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                Alternatives:
                                            </Typography>
                                            <Box ml="20px" mt="10px">
                                                {menuDetails?.selectedBreakfastItems?.alternatives?.map((item) => (
                                                    <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                        - {item.label}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box> */}
                        </Box>
                    )}
                    {menuDetails?.items?.lunch?.length > 0 && (
                        <Box ml="10px" mt="15px">
                            <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                Lunch:
                            </Typography>
                            <Box ml="20px" mt="10px">
                                {menuDetails.items.lunch.map((id) => {
                                    const item = itemList.find((item) => item.id === id); // Find the item in itemList by ID
                                    console.log("item", item)
                                    return (
                                        <Typography key={id} color={colors.gray[100]} variant="body1">
                                            - {item ? item?.item_name : "Item not found"} {/* Display item name or fallback */}
                                        </Typography>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                      {menuDetails?.items?.dinner?.length > 0 && (
                        <Box ml="10px" mt="15px">
                            <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                Dinner:
                            </Typography>
                            <Box ml="20px" mt="10px">
                                {menuDetails.items.dinner.map((id) => {
                                    const item = itemList.find((item) => item.id === id); // Find the item in itemList by ID
                                    console.log("item", item)
                                    return (
                                        <Typography key={id} color={colors.gray[100]} variant="body1">
                                            - {item ? item?.item_name : "Item not found"} {/* Display item name or fallback */}
                                        </Typography>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                    {/* Lunch Section */}
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
                                                {menuDetails?.selectedLunchItems?.lunchSoup?.map((item) => (
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
                                                {menuDetails?.selectedLunchItems?.lunchEntree?.map((item) => (
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
                                                {menuDetails?.selectedLunchItems?.lunchDessert?.map((item) => (
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
                                                {menuDetails?.selectedLunchItems?.lunchAlternatives?.map((item) => (
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

                    {/* Dinner Section */}
                    {/* {(menuDetails?.selectedDinnerItems?.dinnerEntree?.length > 0 ||
                        menuDetails?.selectedDinnerItems?.dinnerAlternatives?.length > 0 ||
                        menuDetails?.selectedDinnerItems?.dinnerDessert?.length > 0) && (
                            <Box ml="10px" mt="15px">
                                <Typography color={colors.gray[100]} variant="h4" fontWeight="600">
                                    Dinner:
                                </Typography>
                                <Box ml="20px">
                                    {menuDetails?.selectedDinnerItems?.dinnerEntree?.length > 0 && (
                                        <Box mt="10px">
                                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                Dinner Entree:
                                            </Typography>
                                            <Box ml="20px" mt="10px">
                                                {menuDetails?.selectedDinnerItems?.dinnerEntree?.map((item) => (
                                                    <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                        - {item.label}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                    {menuDetails?.selectedDinnerItems?.dinnerAlternatives?.length > 0 && (
                                        <Box mt="10px">
                                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                Dinner Alternatives:
                                            </Typography>
                                            <Box ml="20px" mt="10px">
                                                {menuDetails?.selectedDinnerItems?.dinnerAlternatives?.map((item) => (
                                                    <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                        - {item.label}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                    {menuDetails?.selectedDinnerItems?.dinnerDessert?.length > 0 && (
                                        <Box mt="10px">
                                            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
                                                Dinner Dessert:
                                            </Typography>
                                            <Box ml="20px" mt="10px">
                                                {menuDetails?.selectedDinnerItems?.dinnerDessert?.map((item) => (
                                                    <Typography key={item.id} color={colors.gray[100]} variant="body1">
                                                        - {item.label}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )} */}
                </Box>
            </Box>
        </Box>
    );
};

export default MenuDetailsView;
