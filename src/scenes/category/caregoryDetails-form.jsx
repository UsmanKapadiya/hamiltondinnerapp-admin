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
import { useState } from "react";



const validationSchema = yup.object().shape({
    cat_name: yup.string().required("Category Name is required"),
    category_chinese_name: yup.string().required("Category Chinese Name is required"),
    type: yup.string().required("Category Type is required"),
    // parent_id: yup.string().required("Parent Id is required"),
});


const CategoryDetailsForm = () => {
    const location = useLocation();
    const categoryDetails = location.state?.selectedCategory;
    const categoryListData = location.state?.categoryListData;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(false);

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
    const parent_id = categoryListData
        ?.filter((category) => category.id !== categoryDetails?.id)
        .map((category) => ({
            label: category.cat_name,
            value: category.id,
        })) || [];
    const handleFormSubmit = async (values, actions) => {
        setLoading(true)
        const { ...restValues } = values;
        const formData = {
            ...restValues,
        }

        try {
            let response;
            if (formData?.id) {
                // Update menu if ID is available
                response = await CategoryServices.updateCategoryDetails(formData.id, formData);
                console.log(response)
                toast.success("Category updated successfully!");
            } else {
                // Create menu if ID is not available
                response = await CategoryServices.createCategoryDetails(formData);
                toast.success("Category created successfully!");
                actions.resetForm({
                    values: initialValues,
                });
            }
        } catch (error) {
            console.error("Error processing menu:", error);
            toast.error("Failed to process menu. Please try again.");
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
                                onChange={handleChange}
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
                                options={parent_id}
                                getOptionLabel={(option) => option.label}
                                value={parent_id?.find((option) => option.value === values.parent_id) || null}
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
        </Box>
    );
};

export default CategoryDetailsForm;