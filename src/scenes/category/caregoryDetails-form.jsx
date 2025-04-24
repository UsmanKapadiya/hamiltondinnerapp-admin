import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
    categoryName: yup.string().required("Category Name is required"),
    categoryChineseName: yup.string().required("Category Chinese Name is required"),
    categoryType: yup.string().required("Category Type is required"),
    parentId: yup.string().required("Parent Id is required"),
});


const CategoryDetailsForm = () => {
    const location = useLocation();
    const categoryDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const initialValues = {
        categoryName: categoryDetails?.categoryName || "",
        categoryChineseName: categoryDetails?.categoryChineseName || "",
        categoryType: categoryDetails?.categoryType || "",
        parentId: categoryDetails?.parentId || "",
    };

    const parentId = [
        { label: "Breakfast Daily Special", value: "breakfastDailySpecial" },
        { label: "Lunch Soup", value: "lunchSoup" },
        { label: "Dinner Entree", value: "dinnerEntree" },
        { label: "Lunch Entree", value: "LunchEntree" },
        { label: "Lunch Alternative", value: "LunchAlternative" },
        { label: "Dinner Alternative", value: "dinnerAlternative" },
        { label: "Dinner Dessert", value: "dinnerDessert" },
    ];
    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Category Detail" icon={<DvrOutlined />} Buttons={false} />
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
                                label="Category Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.categoryName}
                                name="categoryName"
                                error={touched.categoryName && Boolean(errors.categoryName)}
                                helperText={touched.categoryName && errors.categoryName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Category Chinese Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.categoryChineseName}
                                name="categoryChineseName"
                                error={touched.categoryChineseName && Boolean(errors.categoryChineseName)}
                                helperText={touched.categoryChineseName && errors.categoryChineseName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                select
                                variant="filled"
                                label="Select category type"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.categoryType}
                                name="categoryType"
                                error={touched.categoryType && Boolean(errors.categoryType)}
                                helperText={touched.categoryType && errors.categoryType}
                                sx={{ gridColumn: "span 4" }}
                            >
                                <MenuItem value="breakfast">Breakfast</MenuItem>
                                <MenuItem value="lunch">Lunch</MenuItem>
                                <MenuItem value="dinner">Dinner</MenuItem>
                            </TextField>
                            <Autocomplete
                                options={parentId}
                                getOptionLabel={(option) => option.label}
                                value={parentId.find((option) => option.value === values.parentId) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("parentId", newValue ? newValue.value : ""); // Update parentId correctly
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Parent Id"
                                        variant="filled"
                                        error={touched.parentId && Boolean(errors.parentId)}
                                        helperText={touched.parentId && errors.parentId}
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
                                Save Category Details
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default CategoryDetailsForm;