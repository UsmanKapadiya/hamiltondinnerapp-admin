import { Box, Button, TextField, useMediaQuery, Switch, FormGroup, FormControlLabel, Autocomplete, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { ClearAllOutlined, CreateOutlined, DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { mockBreakFastAlternatives, mockBreakFastDailySpecial, mockDinnerAlternatives, mockDinnerDessert, mockDinnerEntree, mocklunchAlternatives, mocklunchDessert, mocklunchEntree, mockLunchSoups } from "../../data/mockData";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import CategoryServices from "../../services/categoryServices";
import MenuServices from "../../services/menuServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";


const validationSchema = yup.object().shape({
    menu_name: yup.string().required("Menu  Name is required"),
    date: yup.string().required("Date is required"),


});


const MenuDetailsForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const optionsDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);

    const [categoryListData, setCategoryListData] = useState([])

    const BreakFastOptions = categoryListData.filter((category) => category.type === 1);
    const LunchOptions = categoryListData.filter((category) => category.type === 2);
    const DinnerOptions = categoryListData.filter((category) => category.type === 3);

    const [selected, setSelected] = useState("");
    const [selectedItems, setSelectedItems] = useState(optionsDetails?.items?.breakfast || []);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedLunch, setSelectedLunch] = useState("");
    const [selectedLunchItems, setSelectedLunchItems] = useState(optionsDetails?.items?.lunch || []);
    const [lunchSearchTerm, setLunchSearchTerm] = useState("");

    const [selectedDinner, setSelectedDinner] = useState("");
    const [selectedDinnerItems, setSelectedDinnerItems] = useState(optionsDetails?.items?.dinner || []);
    const [dinnerSearchTerm, setDinnerSearchTerm] = useState("");

    const initialValues = {
        id: optionsDetails?.id && optionsDetails?.id,
        menu_name: optionsDetails?.menu_name || "",
        date: optionsDetails?.date || "",
        breakfast: optionsDetails?.items?.breakfast?.length > 0 ? true : false,
        lunch: optionsDetails?.items?.lunch?.length > 0 ? true : false,
        dinner: optionsDetails?.items?.dinner?.length > 0 ? true : false,
        BreakfastItems: optionsDetails?.items?.breakfast || [],
        lunchItems: optionsDetails?.items?.lunch || [],
        dinnerItems: optionsDetails?.items?.dinner || [],
    };

    useEffect(() => {
        getCategoryListData()
    }, [])

    useEffect(() => {
        if (categoryListData.length > 0) {
            if (BreakFastOptions.length > 0 && !selected) {
                setSelected(BreakFastOptions[0]?.cat_name);
            }
            if (LunchOptions.length > 0 && !selectedLunch) {
                setSelectedLunch(LunchOptions[0]?.cat_name);
            }
            if (DinnerOptions.length > 0 && !selectedDinner) {
                setSelectedDinner(DinnerOptions[0]?.cat_name);
            }
        }
    }, [categoryListData, selected, selectedLunch, selectedDinner]);

    const getCategoryListData = async () => {
        try {
            const response = await CategoryServices.getCategoryList();
            setCategoryListData(response?.data)

        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            //   setLoading(false);
        }
    };

    const itemList = useSelector((state) => state.itemState.item);
    // console.log("fetch Redux Data", itemList);

    // Separate items by category
    const categorizedItems = categoryListData.reduce((acc, category) => {
        acc[category.cat_name] = itemList.filter((item) => item.cat_id === category.id);
        return acc;
    }, {});

    // console.log("Categorized Items:", categorizedItems);



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
        if (selectedItems.includes(item.id)) {
            setSelectedItems(selectedItems.filter((id) => id !== item.id));
        } else {
            setSelectedItems([...selectedItems, item.id]);
        }
    };
    const handleSelectLunchItem = (item) => {
        if (selectedLunchItems.includes(item.id)) {
            setSelectedLunchItems(selectedLunchItems.filter((id) => id !== item.id));
        } else {
            setSelectedLunchItems([...selectedLunchItems, item.id]);
        }
    };
    const handleSelectDinnerItem = (item) => {
        if (selectedDinnerItems.includes(item.id)) {
            setSelectedDinnerItems(selectedDinnerItems.filter((id) => id !== item.id));
        } else {
            setSelectedDinnerItems([...selectedDinnerItems, item.id]);
        }
    };

    // SET BREAK FAST DATA
    const renderData = categorizedItems[selected] || [];
    const filteredData = renderData.filter((item) =>
        item?.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // SET LUNCH DATA
    const renderLunchData = categorizedItems[selectedLunch] || [];
    const filtereLunchdData = renderLunchData.filter((item) =>
        item.item_name.toLowerCase().includes(lunchSearchTerm.toLowerCase())
    );

    // SET DINNER DATA
    const renderDinnerData = categorizedItems[selectedDinner] || [];
    const filtereDinnerData = renderDinnerData.filter((item) =>
        item.item_name.toLowerCase().includes(dinnerSearchTerm.toLowerCase())
    );
    const handleFormSubmit = async (values) => {
        setLoading(true)
        const { BreakfastItems, dinnerItems, lunchItems, breakfast, dinner, lunch, ...restValues } = values;
        const formData = {
            ...restValues,
            items: {
                breakfast: selectedItems,
                lunch: selectedLunchItems,
                dinner: selectedDinnerItems,
            },
            is_allday: false,
        };

        console.log(formData);
        try {
            let response;
            if (formData?.id) {
                // Update menu if ID is available
                response = await MenuServices.updateMenus(formData.id, formData);
                toast.success("Menu updated successfully!");
            } else {
                // Create menu if ID is not available
                console.log("formData", formData)
                response = await MenuServices.createMenu(formData);
                toast.success("Menu created successfully!");
            }

            console.log("response", response);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    errors[key].forEach((message) => {
                        toast.error(message);
                    });
                });
            } else {
                toast.error("Failed to process menu. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            {loading && (
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
            )}
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
                                value={values.menu_name}
                                name="menu_name"
                                error={touched.menu_name && Boolean(errors.menu_name)}
                                helperText={touched.menu_name && errors.menu_name}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date"
                                    value={values.date ? dayjs(values.date) : null} // Convert to dayjs if needed
                                    onChange={(newValue) => setFieldValue("date", newValue ? newValue.format("YYYY-MM-DD") : "")}
                                    minDate={dayjs()}
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
                                            {/* Dynamically display categories with type 1 (BREAKFAST) */}
                                            {categoryListData
                                                .filter((category) => category.type === 1) // Filter categories with type 2
                                                .map((category) => (
                                                    <Box
                                                        key={category.id}
                                                        onClick={() => handleSelectCategory(category.cat_name)} // Use category name for selection
                                                        sx={{
                                                            cursor: "pointer",
                                                            bgcolor: selected === category.cat_name ? colors.gray[800] : "transparent",
                                                            p: "10px",
                                                            borderRadius: "8px",
                                                            transition: "background-color 0.3s",
                                                        }}
                                                    >
                                                        <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                            {category.cat_name}
                                                        </Typography>
                                                    </Box>
                                                ))}
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
                                                bgcolor={selectedItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                                                p="10px"
                                                borderRadius="8px"
                                                color={selectedItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                }}
                                                onClick={() => handleSelectItem(item)} // Handle item selection
                                            >
                                                {item.item_name}
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
                                            {/* Dynamically display categories with type 2 (BREAKFAST) */}
                                            {categoryListData
                                                .filter((category) => category.type === 2) // Filter categories with type 2
                                                .map((category) => (
                                                    <Box
                                                        key={category.id}
                                                        onClick={() => handleSelectLunch(category.cat_name)} // Use category name for selection
                                                        sx={{
                                                            cursor: "pointer",
                                                            bgcolor: selectedLunch === category.cat_name ? colors.gray[800] : "transparent",
                                                            p: "10px",
                                                            borderRadius: "8px",
                                                            transition: "background-color 0.3s",
                                                        }}
                                                    >
                                                        <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                            {category.cat_name}
                                                        </Typography>
                                                    </Box>
                                                ))}
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
                                                bgcolor={selectedLunchItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                                                p="10px"
                                                borderRadius="8px"
                                                color={selectedLunchItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                }}
                                                onClick={() => handleSelectLunchItem(item)} // Handle item selection
                                            >
                                                {item.item_name}
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
                                            {/* Dynamically display categories with type 3 (Dinner) */}
                                            {categoryListData
                                                .filter((category) => category.type === 3) // Filter categories with type 2
                                                .map((category) => (
                                                    <Box
                                                        key={category.id}
                                                        onClick={() => handleSelectDinner(category.cat_name)} // Use category name for selection
                                                        sx={{
                                                            cursor: "pointer",
                                                            bgcolor: selectedDinner === category.cat_name ? colors.gray[800] : "transparent",
                                                            p: "10px",
                                                            borderRadius: "8px",
                                                            transition: "background-color 0.3s",
                                                        }}
                                                    >
                                                        <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                                                            {category.cat_name}
                                                        </Typography>
                                                    </Box>
                                                ))}
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
                                                bgcolor={selectedDinnerItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                                                p="10px"
                                                borderRadius="8px"
                                                color={selectedDinnerItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                }}
                                                onClick={() => handleSelectDinnerItem(item)} // Handle item selection
                                            >
                                                {item.item_name}
                                            </Box>
                                        ))}
                                        {/* {filtereDinnerData.map((item) => (
                                            <Box
                                                key={item.id}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bgcolor={selectedDinnerItems.some((selected) => selected.id === item.id) ? colors?.primary[500] : "lightgray"}
                                                p="10px"
                                                borderRadius="8px"
                                                color={selectedItems.some((selected) => selected.id === item.id) ? "white" : "black"}

                                                s sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                    // "&:hover": {
                                                    //     bgcolor: "lightblue",
                                                    // },
                                                }}
                                                onClick={() => handleSelectDinnerItem(item)}
                                            >
                                                {item.item_name}
                                            </Box>
                                        ))} */}
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