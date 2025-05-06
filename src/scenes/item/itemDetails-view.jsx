import React, { useEffect, useState } from "react";
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
import ItemServices from "../../services/itemServices";
import { type } from "../../data/mockData";

const ItemDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    const location = useLocation();
    // const itemDetails = location.state;
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
            console.log(response?.data)
            setItemDetails(response?.data);

        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            setLoading(false);
        }
    };

    const Categorys = [
        { label: "Breakfast Daily Special", value: "breakfastDailySpecial" },
        { label: "Lunch Soup", value: "lunchSoup" },
        { label: "Dinner Entree", value: "dinnerEntree" },
        { label: "Lunch Entree", value: "LunchEntree" },
        { label: "Lunch Alternative", value: "LunchAlternative" },
        { label: "Dinner Alternative", value: "dinnerAlternative" },
        { label: "Dinner Dessert", value: "dinnerDessert" },
    ];
    const Options = [
        { label: "Rice", value: "rice" },
        { label: "Noodles", value: "noodles" },
        { label: "Yam Fries (extra $5)", value: "yamFries" },
    ];

    const Preferences = [
        { label: "Less Oil", value: "lessOil" },
        { label: "Less Salt", value: "lessSalt" },
        { label: "Less Sugar", value: "lessSugar" },
        { label: "No Rice", value: "noRice" },
    ];
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
                            const typeObj = type.find((t) => t.id === typeId);
                            return typeObj ? typeObj.type_name : "N/A";
                        })()}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                        Is Allday
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {itemDetails?.isAllDay}
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
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {Options.find((option) => option.value === itemDetails?.options)?.label || "N/A"}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                        Preference
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {Preferences.find((option) => option.value === itemDetails?.preference)?.label || "N/A"}
                    </Typography>
                </Box>

            </Box>
        </Box>
    );
};

export default ItemDetailsView;
