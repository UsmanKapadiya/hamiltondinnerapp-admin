import { Box, Button, TextField, useMediaQuery, Autocomplete, FormHelperText, FormControlLabel, Radio, RadioGroup, FormControl, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { type } from "../../data/mockData";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { useEffect, useState } from "react";

const validationSchema = yup.object().shape({
    cat_name: yup.string().required("Course Name is required"),
    // category_chinese_name: yup.string().required("Category Chinese Name is required"),
    type: yup.string().required("Course Type is required"),
    // parent_id: yup.string().required("Parent Id is required"),
});

const CategoryDetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const [categoryDetails, setCategoryDetails] = useState(null);
    const categoryListData = location.state?.categoryListData || [];
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(true);
    const [filteredParentOptions, setFilteredParentOptions] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedDetails = location.state?.selectedCategory;
            setCategoryDetails(fetchedDetails);
            setLoading(false);
        }, 500); // Reduced timeout for better UX
        return () => clearTimeout(timer);
    }, [location.state]);

    useEffect(() => {
        if (categoryDetails?.type) {
            const filteredOptions = categoryListData
                .filter(
                    (category) =>
                        category.type === categoryDetails.type &&
                        category.id !== categoryDetails.id
                )
                .map((category) => ({
                    label: category.cat_name,
                    value: category.id,
                    type: category.type,
                }));
            setFilteredParentOptions(filteredOptions);
        }
    }, [categoryDetails?.type, categoryDetails?.id, categoryListData]);

    const initialValues = {
        id: categoryDetails?.id || "",
        cat_name: categoryDetails?.cat_name || "",
        category_chinese_name: categoryDetails?.category_chinese_name || "",
        type: categoryDetails?.type || "",
        parent_id: categoryDetails?.parent_id || "",
    };

    const handleFormSubmit = async (values, actions) => {
        setLoading(true);
        try {
            let response;
            if (values.id) {
                response = await CategoryServices.updateCategoryDetails(values.id, values);
                toast.success("Course updated successfully!");
            } else {
                response = await CategoryServices.createCategoryDetails(values);
                toast.success("Course created successfully!");
            }
            setCategoryDetails(response?.data);
            actions.resetForm({ values: { ...response?.data } });
            if (response?.success === true) {
                navigate("/category-details");
            }
        } catch (error) {
            toast.error("Failed to process Course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header
                title={
                    loading
                        ? ""
                        : categoryDetails?.id
                            ? "Update Course Detail"
                            : "Add Course Detail"
                }
                icon={<DvrOutlined />}
                Buttons={false}
            />
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="calc(100vh - 100px)"
                >
                    <CustomLoadingOverlay />
                </Box>
            ) : (
                <Formik
                    enableReinitialize
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
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
                                    label="Course Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.cat_name}
                                    name="cat_name"
                                    error={touched.cat_name && Boolean(errors.cat_name)}
                                    helperText={touched.cat_name && errors.cat_name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Course Chinese Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category_chinese_name}
                                    name="category_chinese_name"
                                    error={
                                        touched.category_chinese_name &&
                                        Boolean(errors.category_chinese_name)
                                    }
                                    helperText={
                                        touched.category_chinese_name &&
                                        errors.category_chinese_name
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <FormControl
                                    component="fieldset"
                                    sx={{ gridColumn: "span 4" }}
                                    error={touched.type && Boolean(errors.type)}
                                >
                                    <Typography variant="subtitle1" fontWeight="400" mb="10px">
                                        Select Meal Type
                                    </Typography>
                                    <RadioGroup
                                        name="type"
                                        value={String(values.type)}
                                        onChange={(e) => {
                                            const selectedType = e.target.value;
                                            handleChange(e);
                                            setFieldValue("type", selectedType);

                                            const filteredOptions = categoryListData
                                                .filter(
                                                    (category) =>
                                                        String(category.type) === selectedType &&
                                                        category.id !== values.id &&
                                                        category?.parent_id === 0
                                                )
                                                .map((category) => ({
                                                    label: category.cat_name,
                                                    value: category.id,
                                                    type: category.type,
                                                }));

                                            setFilteredParentOptions(filteredOptions);
                                            setFieldValue("parent_id", ""); // Reset parent_id when type changes
                                        }}

                                        row
                                    >
                                        {type.map((option) => (
                                            <FormControlLabel
                                                key={option.id}
                                                value={String(option.id)}
                                                control={<Radio color="secondary" />}
                                                label={option.type_name}
                                            />
                                        ))}
                                    </RadioGroup>
                                    {touched.type && errors.type && (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    )}
                                </FormControl>
                                {filteredParentOptions?.length > 0 && values.type && (
                                    <FormControl component="fieldset" sx={{ gridColumn: "span 4" }}>
                                        <Typography variant="subtitle1" fontWeight="400" mb="10px">
                                            Select Parent Course
                                        </Typography>
                                        <RadioGroup
                                            name="parent_id"
                                            value={String(values.parent_id)}
                                            onChange={(e) => setFieldValue("parent_id", e.target.value)}
                                            row
                                        >
                                            {filteredParentOptions.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    value={String(option.value)}
                                                    control={<Radio color="secondary" />}
                                                    label={option.label}
                                                />
                                            ))}
                                        </RadioGroup>
                                        {touched.parent_id && errors.parent_id && (
                                            <FormHelperText error>{errors.parent_id}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="end"
                                mt="20px"
                            >
                                <Button type="submit" color="secondary" variant="contained">
                                    Save Course Details
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}
        </Box>
    );
};

export default CategoryDetailsForm;
