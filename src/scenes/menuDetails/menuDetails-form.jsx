import { Box, Button, TextField, useMediaQuery, Switch, FormGroup, FormControlLabel, Autocomplete, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { ClearAllOutlined, CreateOutlined, DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { mockBreakFastAlternatives, mockBreakFastDailySpecial, mockDinnerAlternatives, mockDinnerDessert, mockDinnerEntree, mocklunchAlternatives, mocklunchDessert, mocklunchEntree, mockLunchSoups } from "../../data/mockData";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const validationSchema = yup.object().shape({
    menuName: yup.string().required("Menu  Name is required"),
    date: yup.string().required("Date is required"),


});


const MenuDetailsForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const optionsDetails = location.state;
    console.log("optionsDetails", optionsDetails);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // Prepopulate states with optionsDetails data for editing
    const [selected, setSelected] = useState("dailySpecial");
    const [selectedItems, setSelectedItems] = useState(
        optionsDetails?.selectedBreakfastItems?.dailySpecial.concat(
            optionsDetails?.selectedBreakfastItems?.alternatives
        ) || []
    );
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedLunch, setSelectedLunch] = useState("lunchSoup");
    const [selectedLunchItems, setSelectedLunchItems] = useState(
        optionsDetails?.selectedLunchItems?.lunchSoup.concat(
            optionsDetails?.selectedLunchItems?.lunchEntree,
            optionsDetails?.selectedLunchItems?.lunchDessert,
            optionsDetails?.selectedLunchItems?.lunchAlternatives
        ) || []
    );
    const [lunchSearchTerm, setLunchSearchTerm] = useState("");

    const [selectedDinner, setSelectedDinner] = useState("dinnerEntree");
    const [selectedDinnerItems, setSelectedDinnerItems] = useState(
        optionsDetails?.selectedDinnerItems?.dinnerEntree.concat(
            optionsDetails?.selectedDinnerItems?.dinnerAlternatives,
            optionsDetails?.selectedDinnerItems?.dinnerDessert
        ) || []
    );
    const [dinnerSearchTerm, setDinnerSearchTerm] = useState("");

    const handleSelectCategory = (category) => {
        setSelected(category);
        setSearchTerm("");
    };

    const handleSelectLunch = (category) => {
        setSelectedLunch(category);
        setLunchSearchTerm("");
    };

    const handleSelectDinner = (category) => {
        setSelectedDinner(category);
        setDinnerSearchTerm("");
    };

    const handleSelectItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSelectLunchItem = (item) => {
        if (selectedLunchItems.includes(item)) {
            setSelectedLunchItems(selectedLunchItems.filter((i) => i !== item));
        } else {
            setSelectedLunchItems([...selectedLunchItems, item]);
        }
    };

    const handleSelectDinnerItem = (item) => {
        if (selectedDinnerItems.includes(item)) {
            setSelectedDinnerItems(selectedDinnerItems.filter((i) => i !== item));
        } else {
            setSelectedDinnerItems([...selectedDinnerItems, item]);
        }
    };

    const renderData = selected === "dailySpecial" ? mockBreakFastDailySpecial : mockBreakFastAlternatives;
    const filteredData = renderData.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderLunchData =
        selectedLunch === "lunchSoup"
            ? mockLunchSoups
            : selectedLunch === "lunchEntree"
            ? mocklunchEntree
            : selectedLunch === "lunchDessert"
            ? mocklunchDessert
            : mocklunchAlternatives;
    const filtereLunchdData = renderLunchData.filter((item) =>
        item.label.toLowerCase().includes(lunchSearchTerm.toLowerCase())
    );

    const renderDinnerData =
        selectedDinner === "dinnerEntree"
            ? mockDinnerEntree
            : selectedDinner === "dinnerDessert"
            ? mockDinnerDessert
            : mockDinnerAlternatives;
    const filtereDinnerData = renderDinnerData.filter((item) =>
        item.label.toLowerCase().includes(dinnerSearchTerm.toLowerCase())
    );

    const initialValues = {
        menuName: optionsDetails?.menuName || "",
        date: optionsDetails?.date || "",
        breakfast: optionsDetails?.breakfast || false,
        lunch: optionsDetails?.lunch || false,
        dinner: optionsDetails?.dinner || false,
        selectedBreakfastItems: {
            dailySpecial: optionsDetails?.selectedBreakfastItems?.dailySpecial || [],
            alternatives: optionsDetails?.selectedBreakfastItems?.alternatives || [],
        },
        selectedLunchItems: {
            lunchSoup: optionsDetails?.selectedLunchItems?.lunchSoup || [],
            lunchEntree: optionsDetails?.selectedLunchItems?.lunchEntree || [],
            lunchDessert: optionsDetails?.selectedLunchItems?.lunchDessert || [],
            lunchAlternatives: optionsDetails?.selectedLunchItems?.lunchAlternatives || [],
        },
        selectedDinnerItems: {
            dinnerEntree: optionsDetails?.selectedDinnerItems?.dinnerEntree || [],
            dinnerAlternatives: optionsDetails?.selectedDinnerItems?.dinnerAlternatives || [],
            dinnerDessert: optionsDetails?.selectedDinnerItems?.dinnerDessert || [],
        },
    };

    const handleFormSubmit = (values) => {
        const formData = {
            ...values,
            selectedBreakfastItems: {
                dailySpecial: selectedItems.filter((item) =>
                    mockBreakFastDailySpecial.some((special) => special.id === item.id)
                ),
                alternatives: selectedItems.filter((item) =>
                    mockBreakFastAlternatives.some((alternative) => alternative.id === item.id)
                ),
            },
            selectedLunchItems: {
                lunchSoup: selectedLunchItems.filter((item) =>
                    mockLunchSoups.some((soup) => soup.id === item.id)
                ),
                lunchEntree: selectedLunchItems.filter((item) =>
                    mocklunchEntree.some((entree) => entree.id === item.id)
                ),
                lunchDessert: selectedLunchItems.filter((item) =>
                    mocklunchDessert.some((dessert) => dessert.id === item.id)
                ),
                lunchAlternatives: selectedLunchItems.filter((item) =>
                    mocklunchAlternatives.some((alternative) => alternative.id === item.id)
                ),
            },
            selectedDinnerItems: {
                dinnerEntree: selectedDinnerItems.filter((item) =>
                    mockDinnerEntree.some((entree) => entree.id === item.id)
                ),
                dinnerAlternatives: selectedDinnerItems.filter((item) =>
                    mockDinnerAlternatives.some((alternative) => alternative.id === item.id)
                ),
                dinnerDessert: selectedDinnerItems.filter((item) =>
                    mockDinnerDessert.some((dessert) => dessert.id === item.id)
                ),
            },
        };

        console.log("Form Submitted:", formData);
    };


    return (
        <Box m="20px">
            <Header title="Add Menu Detail" icon={<CreateOutlined />} Buttons={false} />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnBlur={true}
                validateOnChange={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": {
                                    gridColumn: isNonMobile ? undefined : "span 4",
                                },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Menu Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.menuName}
                                name="menuName"
                                error={touched.menuName && Boolean(errors.menuName)}
                                helperText={touched.menuName && errors.menuName}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
                                    value={values.date ? dayjs(values.date) : null} // Convert to dayjs if needed
                                    onChange={(newValue) => setFieldValue("date", newValue ? newValue.format("YYYY-MM-DD") : "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="filled"
                                            error={touched.date && Boolean(errors.date)}
                                            helperText={touched.date && errors.date}
                                            sx={{ gridColumn: "span 1" }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            <FormGroup sx={{ gridColumn: "span 1" }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={values.breakfast}
                                            onChange={(e) => setFieldValue("breakfast", e.target.checked)}
                                            name="breakfast"
                                        />
                                    }
                                    label="Breakfast"
                                />
                            </FormGroup>
                        </Box>
                        {values.breakfast && (
                            <>
                                <Box mt="15px">
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search item..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        sx={{ mb: "20px" }}
                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gap="20px"
                                    mt="15px"
                                    gridTemplateColumns="repeat(8, 1fr)"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 2" }}
                                        height={350}
                                    >
                                        <Box p="15px">
                                            <Box
                                                onClick={() => handleSelectCategory("dailySpecial")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selected === "dailySpecial" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    BreakFast Daily Special
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={() => handleSelectCategory("alternatives")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selected === "alternatives" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    BreakFast Alternatives
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="grid"
                                        gap="20px"
                                        gridTemplateColumns="repeat(3, 1fr)"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 6" }}
                                        height={350}
                                        overflow='auto'
                                    >
                                        {filteredData.map((item) => (
                                            <Box
                                                key={item.id}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bgcolor={selectedItems.includes(item) ? "lightblue" : "lightgray"}
                                                p="10px"
                                                borderRadius="8px"
                                                color="black"
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                    "&:hover": {
                                                        bgcolor: "lightblue",
                                                    },
                                                }}
                                                onClick={() => handleSelectItem(item)}
                                            >
                                                {item.label}
                                            </Box>
                                        ))}
                                    </Box>

                                </Box>
                            </>
                        )}
                        <Box mt="20px">
                            <FormGroup sx={{ gridColumn: "span 1" }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={values.lunch}
                                            onChange={(e) => setFieldValue("lunch", e.target.checked)}
                                            name="lunch"
                                        />
                                    }
                                    label="Lunch"
                                />
                            </FormGroup>
                        </Box>
                        {/* LUNCH */}
                        {values.lunch && (
                            <>
                                <Box mt="15px">
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search item..."
                                        value={lunchSearchTerm}
                                        onChange={(e) => setLunchSearchTerm(e.target.value)}
                                        sx={{ mb: "20px" }}
                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gap="20px"
                                    mt="15px"
                                    gridTemplateColumns="repeat(8, 1fr)"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <Box p="15px">
                                            <Box
                                                onClick={() => handleSelectLunch("lunchSoup")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedLunch === "lunchSoup" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    LUNCH SOUP
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={() => handleSelectLunch("lunchEntree")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedLunch === "lunchEntree" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    LUNCH ENTREE
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={() => handleSelectLunch("lunchDessert")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedLunch === "lunchDessert" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    LUNCH DESSERT
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={() => handleSelectLunch("lunchAlternatives")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedLunch === "lunchAlternatives" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    LUNCH ALTERNATIVES
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="grid"
                                        gap="20px"
                                        gridTemplateColumns="repeat(3, 1fr)"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        height={350}
                                        overflow="auto"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 6" }}
                                    >
                                        {filtereLunchdData.map((item) => (
                                            <Box
                                                key={item.id}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bgcolor={selectedLunchItems.includes(item) ? "lightblue" : "lightgray"}
                                                p="10px"
                                                borderRadius="8px"

                                                color="black"
                                                s sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                    "&:hover": {
                                                        bgcolor: "lightblue",
                                                    },
                                                }}
                                                onClick={() => handleSelectLunchItem(item)}
                                            >
                                                {item.label}
                                            </Box>
                                        ))}
                                    </Box>

                                </Box>
                            </>
                        )}
                        <Box mt="20px">
                            <FormGroup sx={{ gridColumn: "span 1" }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={values.dinner}
                                            onChange={(e) => setFieldValue("dinner", e.target.checked)}
                                            name="Dinner"
                                        />
                                    }
                                    label="Dinner"
                                />
                            </FormGroup>
                        </Box>
                        {/* Dinner */}
                        {values.dinner && (
                            <>
                                <Box mt="15px">
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search item..."
                                        value={dinnerSearchTerm}
                                        onChange={(e) => setDinnerSearchTerm(e.target.value)}
                                        sx={{ mb: "20px" }}
                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gap="20px"
                                    mt="15px"
                                    gridTemplateColumns="repeat(8, 1fr)"
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 2" }}
                                    >
                                        <Box p="15px">
                                            <Box
                                                onClick={() => handleSelectDinner("dinnerEntree")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedDinner === "dinnerEntree" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    DINNER ENTREE
                                                </Typography>
                                            </Box>

                                            <Box
                                                onClick={() => handleSelectDinner("dinnerAlternatives")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedDinner === "dinnerAlternatives" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    DINNER ALTERNATIVES
                                                </Typography>
                                            </Box>
                                            <Box
                                                onClick={() => handleSelectDinner("dinnerDessert")}
                                                sx={{
                                                    cursor: "pointer",
                                                    bgcolor: selectedDinner === "dinnerDessert" ? colors.gray[800] : "transparent",
                                                    p: "10px",
                                                    borderRadius: "8px",
                                                    transition: "background-color 0.3s",
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                    DINNER DESSERT
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="grid"
                                        gap="20px"
                                        gridTemplateColumns="repeat(3, 1fr)"
                                        bgcolor={colors.primary[400]}
                                        p="20px"
                                        height={350}
                                        overflow="auto"
                                        borderRadius="8px"
                                        sx={{ gridColumn: "span 6" }}
                                    >
                                        {filtereDinnerData.map((item) => (
                                            <Box
                                                key={item.id}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bgcolor={selectedDinnerItems.includes(item) ? "lightblue" : "lightgray"}
                                                p="10px"
                                                borderRadius="8px"

                                                color="black"
                                                s sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                    "&:hover": {
                                                        bgcolor: "lightblue",
                                                    },
                                                }}
                                                onClick={() => handleSelectDinnerItem(item)}
                                            >
                                                {item.label}
                                            </Box>
                                        ))}
                                    </Box>

                                </Box>
                            </>
                        )}
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            mt="20px"
                        >
                            <Button type="submit" color="secondary" variant="contained">
                                Save
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default MenuDetailsForm;