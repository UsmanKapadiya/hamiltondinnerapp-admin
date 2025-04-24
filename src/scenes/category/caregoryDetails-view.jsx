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

const CategoryDetailsView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");

    const location = useLocation();
    const categoryDetails = location.state;

    const parentId = [
        { label: "Breakfast Daily Special", value: "breakfastDailySpecial" },
        { label: "Lunch Soup", value: "lunchSoup" },
        { label: "Dinner Entree", value: "dinnerEntree" },
        { label: "Lunch Entree", value: "LunchEntree" },
        { label: "Lunch Alternative", value: "LunchAlternative" },
        { label: "Dinner Alternative", value: "dinnerAlternative" },
        { label: "Dinner Dessert", value: "dinnerDessert" },
    ];
    return (
        <Box m="20px">
            <Header
                title="Room Details View"
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
                        Category Name
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {categoryDetails?.categoryName}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                        Category Chinese Name
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {categoryDetails?.categoryChineseName}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                    Type
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {categoryDetails?.categoryType === "lunch" ? "Lunch" : "dinner" ?  "Dinner" : "Breakfast"}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
                <Box p="10px">
                    <Typography color={colors.gray[100]} variant="h3" fontWeight="600">
                    Parent Id
                    </Typography>
                    <Typography color={colors.gray[100]} variant="h5" fontWeight="600" mt="10px">
                        {parentId.find((option) => option.value === categoryDetails?.parentId)?.label || "N/A"}
                    </Typography>
                </Box>
                <Divider sx={{ bgcolor: colors.gray[300] }} />
              
            </Box>
        </Box>
    );
};

export default CategoryDetailsView;
