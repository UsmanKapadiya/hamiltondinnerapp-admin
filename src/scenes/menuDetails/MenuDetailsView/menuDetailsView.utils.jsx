import React from "react";
import {
    Box,
    Typography,
} from "@mui/material";

// Format Date
export const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
};

// Render Normal Menu Section
export const renderMenuSection =
    ({
        title,
        items,
        itemList,
        colors,
    }) => {
        if (!items?.length)
            return null;

        return (
            <Box ml="10px" mt="15px">
                <Typography
                    color={
                        colors.gray[100]
                    }
                    variant="h4"
                    fontWeight="600"
                >
                    {title}:
                </Typography>

                <Box ml="20px" mt="10px">
                    {items.map((id) => {
                        const item =
                            itemList.find(
                                (itm) =>
                                    itm.id === id
                            );

                        const isDummyImage =
                            item?.item_image ===
                            "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp";

                        return (
                            <Box
                                key={id}
                                display="flex"
                                alignItems="center"
                                mb={1}
                            >
                                {item?.item_image &&
                                    !isDummyImage && (
                                        <img
                                            src={
                                                item.item_image
                                            }
                                            alt={
                                                item.item_name
                                            }
                                            style={{
                                                width: 40,
                                                height: 40,
                                                objectFit:
                                                    "cover",
                                                borderRadius: 4,
                                                marginRight: 12,
                                            }}
                                        />
                                    )}

                                <Typography
                                    color={
                                        colors.gray[100]
                                    }
                                    variant="body1"
                                >
                                    -{" "}
                                    {item?.item_name ||
                                        "Menu Item not found"}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    };

// Render Advanced Lunch Section
export const renderAdvancedSection =
    ({
        selectedLunchItems,
        colors,
    }) => {
        if (!selectedLunchItems)
            return null;

        const sections = [
            {
                key: "lunchSoup",
                title: "Lunch Soup",
            },
            {
                key: "lunchEntree",
                title: "Lunch Entree",
            },
            {
                key: "lunchDessert",
                title:
                    "Lunch Dessert",
            },
            {
                key:
                    "lunchAlternatives",
                title:
                    "Lunch Alternatives",
            },
        ];

        const hasData =
            sections.some(
                (section) =>
                    selectedLunchItems[
                        section.key
                    ]?.length > 0
            );

        if (!hasData) return null;

        return (
            <Box ml="10px" mt="15px">
                <Typography
                    color={
                        colors.gray[100]
                    }
                    variant="h4"
                    fontWeight="600"
                >
                    Lunch:
                </Typography>

                <Box ml="20px">
                    {sections.map(
                        ({
                            key,
                            title,
                        }) => {
                            const items =
                                selectedLunchItems[
                                key
                                ];

                            if (!items?.length)
                                return null;

                            return (
                                <Box
                                    key={key}
                                    mt="10px"
                                >
                                    <Typography
                                        color={
                                            colors.gray[100]
                                        }
                                        variant="h5"
                                        fontWeight="600"
                                    >
                                        {title}:
                                    </Typography>

                                    <Box
                                        ml="20px"
                                        mt="10px"
                                    >
                                        {items.map(
                                            (
                                                item
                                            ) => (
                                                <Typography
                                                    key={
                                                        item.id
                                                    }
                                                    color={
                                                        colors.gray[100]
                                                    }
                                                    variant="body1"
                                                >
                                                    -{" "}
                                                    {
                                                        item.label
                                                    }
                                                </Typography>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            );
                        }
                    )}
                </Box>
            </Box>
        );
    };
