import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
    itemName: yup.string().required("Item  Name is required"),
    itemChineseName: yup.string().required("Item  Chinese Name is required"),
    options: yup.string().required("Item  Type is required"),
    category: yup.string().required("Parent Id is required"),
});


const ItemDetailsForm = () => {
    const location = useLocation();
    const itemDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const initialValues = {
        itemName: itemDetails?.itemName || "",
        itemChineseName: itemDetails?.itemChineseName || "",
        category: itemDetails?.category || "",
        isAllDay: itemDetails?.isAllDay || false,
        options: itemDetails?.options || "",
        preference: itemDetails?.preference || "",
        image: null, // Added for image upload
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
    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Item  Detail" icon={<DvrOutlined />} Buttons={false} />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnBlur={true} // Enable validation on blur
                validateOnChange={true} // Enable validation on change
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
                                label="Item Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.itemName}
                                name="itemName"
                                error={touched.itemName && Boolean(errors.itemName)}
                                helperText={touched.itemName && errors.itemName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Item Chinese Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.itemChineseName}
                                name="itemChineseName"
                                error={touched.itemChineseName && Boolean(errors.itemChineseName)}
                                helperText={touched.itemChineseName && errors.itemChineseName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <Autocomplete
                                options={Categorys}
                                getOptionLabel={(option) => option.label}
                                value={Categorys.find((option) => option.value === values.category) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("category", newValue ? newValue.value : ""); // Update category correctly
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Category"
                                        variant="filled"
                                        error={touched.category && Boolean(errors.category)}
                                        helperText={touched.category && errors.category}
                                    />
                                )}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={values.isAllDay}
                                            onChange={(e) => setFieldValue("isAllDay", e.target.checked)}
                                            name="isAllDay"
                                        />
                                    }
                                    label="Is Allday"
                                />
                            </FormGroup>
                            {/* Add Image Upload */}
                            <TextField
                                fullWidth
                                type="file"
                                variant="filled"
                                label="Upload Image"
                                InputLabelProps={{ shrink: true }}
                                onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <Autocomplete
                                options={Options}
                                getOptionLabel={(option) => option.label}
                                value={Options.find((option) => option.value === values.options) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("options", newValue ? newValue.value : "");
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Options"
                                        variant="filled"
                                        error={touched.options && Boolean(errors.options)}
                                        helperText={touched.options && errors.options}
                                    />
                                )}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <Autocomplete
                                options={Preferences}
                                getOptionLabel={(option) => option.label}
                                value={Preferences.find((option) => option.value === values.preference) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("preference", newValue ? newValue.value : "");
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Preference"
                                        variant="filled"
                                        error={touched.preference && Boolean(errors.preference)}
                                        helperText={touched.preference && errors.preference}
                                    />
                                )}
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            mt="20px"
                        >
                            <Button type="submit" color="secondary" variant="contained">
                                Save Item  Details
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default ItemDetailsForm;