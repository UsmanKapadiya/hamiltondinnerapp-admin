import { Box, Button, TextField, useMediaQuery, MenuItem, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { type } from "../../data/mockData";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { useEffect, useState } from "react";



const validationSchema = yup.object().shape({
    cat_name: yup.string().required("Category Name is required"),
    category_chinese_name: yup.string().required("Category Chinese Name is required"),
    type: yup.string().required("Category Type is required"),
    // parent_id: yup.string().required("Parent Id is required"),
});


const CategoryDetailsForm = () => {
    const location = useLocation();
    const [categoryDetails, setcCategoryDetails] = useState(true);
    const categoryListData = location.state?.categoryListData;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(true);
    const [filteredParentOptions, setFilteredParentOptions] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedDetails = location.state?.selectedCategory;
            setcCategoryDetails(fetchedDetails);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [location.state]);

    useEffect(() => {
        if (categoryDetails?.type) {
            const filteredOptions = categoryListData
                ?.filter((category) => category.type === categoryDetails.type && category.id !== categoryDetails.id)
                .map((category) => ({
                    label: category.cat_name,
                    value: category.id,
                    type: category?.type,
                })) || [];
            setFilteredParentOptions(filteredOptions);
        }
    }, [categoryDetails?.type, categoryListData]);

    const initialValues = {
        id: categoryDetails?.id || "",
        cat_name: categoryDetails?.cat_name || "",
        category_chinese_name: categoryDetails?.category_chinese_name || "",
        type: (() => {
            if (!categoryDetails) return "";
            const typeId = categoryDetails?.type;
            const typeObj = type.find((t) => t.id === typeId);
            return typeObj ? typeObj.id : "";
        })(),
        parent_id: (() => {
            if (!categoryDetails) return 0;
            const parentId = categoryDetails?.parent_id;
            const parentObj = categoryListData.find((t) => t.id === parentId);
            return parentObj ? parentObj.id : 0;
        })(),
    };

    const handleFormSubmit = async (values, actions) => {
        setLoading(true);

        const payload = {
            ...values,
        };

        try {
            let response;
            if (payload?.id) {
                // Update category if ID is available
                response = await CategoryServices.updateCategoryDetails(payload.id, payload);
                toast.success("Category updated successfully!");
                setcCategoryDetails(response?.data); // Update categoryDetails with the new data
            } else {
                // Create category if ID is not available
                response = await CategoryServices.createCategoryDetails(payload);
                toast.success("Category created successfully!");
                setcCategoryDetails(response?.data); // Set categoryDetails with the created data
            }
            actions.resetForm({
                values: {
                    ...response?.data, // Reset form with updated values
                },
            });
        } catch (error) {
            toast.error("Failed to process category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Header title={loading ? "" : categoryDetails?.id ? "Update Category Detail" : "Add Category Detail"} icon={<DvrOutlined />} Buttons={false} />
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
                                    label="Category Name"
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
                                    label="Category Chinese Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category_chinese_name}
                                    name="category_chinese_name"
                                    error={touched.category_chinese_name && Boolean(errors.category_chinese_name)}
                                    helperText={touched.category_chinese_name && errors.category_chinese_name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    select
                                    variant="filled"
                                    label="Select category type"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const selectedType = e.target.value;
                                        setFieldValue("type", selectedType);
                                        // Filter parent options based on the selected type
                                        const filteredOptions = categoryListData
                                            ?.filter((category) => category.type === selectedType && category.id !== values.id)
                                            .map((category) => ({
                                                label: category.cat_name,
                                                value: category.id,
                                                type: category?.type,
                                            })) || [];
                                        setFilteredParentOptions(filteredOptions);
                                    }}
                                    value={values.type}
                                    name="type"
                                    error={touched.type && Boolean(errors.type)}
                                    helperText={touched.type && errors.type}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    {type.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.type_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Autocomplete
                                    options={filteredParentOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={filteredParentOptions?.find((option) => option.value === values.parent_id) || null}
                                    onChange={(event, newValue) => {
                                        setFieldValue("parent_id", newValue ? newValue.value : ""); // Update parent_id correctly
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Parent Id"
                                            variant="filled"
                                            error={touched.parent_id && Boolean(errors.parent_id)}
                                            helperText={touched.parent_id && errors.parent_id}
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
            )}
        </Box>
    );
};

export default CategoryDetailsForm;