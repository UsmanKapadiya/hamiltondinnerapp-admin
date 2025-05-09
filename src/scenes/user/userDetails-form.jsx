import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import ItemServices from "../../services/itemServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { useEffect, useState } from "react";



const validationSchema = yup.object().shape({
    item_name: yup.string().required("Item Name is required"),
    item_chinese_name: yup.string().required("Item Chinese Name is required"),
    options: yup
        .array()
        .of(yup.string().required("Each option must be a string"))
        .min(1, "At least one option is required")
        .required("Options are required"),
    cat_id: yup
        .number()
        .typeError("Parent Id must be a number")
        .required("Parent Id is required"),
    is_allday: yup.boolean().required("Is All Day is required"),
    preference: yup
        .array()
        .of(yup.string().required("Each preference must be a string"))
        .min(1, "At least one preference is required")
        .required("preference are required"),
});


const UserDetailsForm = () => {
    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState()
    const categoryListData = location.state?.categoryListData || [];
    const optionsListData = location.state?.optionsList || [];
    const peferencesListData = location.state?.peferencesList || [];
    const initialValues = {
        id: userList?.id || "",
        item_name: userList?.item_name || "",
        item_chinese_name: userList?.item_chinese_name || "",
        cat_id: userList?.cat_id || 0,
        is_allday: userList?.is_allday || false,
        options: (() => {
            try {
                return userList?.options
                    ? JSON.parse(userList.options).map(String)
                    : [];
            } catch (error) {
                console.error("Error parsing options:", error);
                return [];
            }
        })(),
        preference: (() => {
            try {
                return userList?.preference
                    ? JSON.parse(userList.preference).map(String)
                    : [];
            } catch (error) {
                console.error("Error parsing preference:", error);
                return [];
            }
        })(),
        image: null,
    };

     useEffect(() => {
            const timer = setTimeout(() => {
                const fetchedItemDetails = location.state?.selectedRow;
                setUserList(fetchedItemDetails);
                setLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        }, [location.state])

    const categoryData = categoryListData.map((category) => ({
        label: category.cat_name,
        value: category.id,
    }));

    const optionData = optionsListData.map((opt) => ({
        label: opt.option_name,
        value: opt.id,
    }));

    const handleFormSubmit = async (values) => {

        const payload = {
            ...values,
            options: JSON.stringify(values.options),
            preference: JSON.stringify(values.preference),
        };
        console.log("Form Submitted:", payload);

        try {
            let response;
            if (payload?.id) {
                // Update Items if ID is available
                response = await ItemServices.updatetItems(payload.id, payload);
                toast.success("Items updated successfully!");
            } else {
                // Create Items if ID is not available
                response = await ItemServices.createItems(payload);
                toast.success("Items created successfully!");
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
            
            <Header title={loading ?  "":userList?.id  ? "Update Item Detail":"Add Item Detail"} icon={<DvrOutlined />} Buttons={false} />
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
                    validateOnBlur
                    validateOnChange
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
                                {/* Item Name */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Item Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.item_name}
                                    name="item_name"
                                    error={touched.item_name && Boolean(errors.item_name)}
                                    helperText={touched.item_name && errors.item_name}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Item Chinese Name */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Item Chinese Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.item_chinese_name}
                                    name="item_chinese_name"
                                    error={
                                        touched.item_chinese_name && Boolean(errors.item_chinese_name)
                                    }
                                    helperText={touched.item_chinese_name && errors.item_chinese_name}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Category Dropdown */}
                                <Autocomplete
                                    options={categoryData}
                                    getOptionLabel={(option) => option.label}
                                    value={
                                        categoryData.find((option) => option.value === values.cat_id) ||
                                        null
                                    }
                                    onChange={(event, newValue) => {
                                        setFieldValue("cat_id", newValue ? newValue.value : 0);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Category"
                                            variant="filled"
                                            error={touched.cat_id && Boolean(errors.cat_id)}
                                            helperText={touched.cat_id && errors.cat_id}
                                        />
                                    )}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Is All Day Switch */}
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={values.is_allday}
                                                onChange={(e) =>
                                                    setFieldValue("is_allday", e.target.checked)
                                                }
                                                name="is_allday"
                                            />
                                        }
                                        label="Is All Day"
                                    />
                                </FormGroup>

                                {/* Image Upload */}
                                <TextField
                                    fullWidth
                                    type="file"
                                    variant="filled"
                                    label="Upload Image"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(event) =>
                                        setFieldValue("image", event.currentTarget.files[0])
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Options Multi-Select */}
                                <Autocomplete
                                    multiple
                                    options={optionData}
                                    getOptionLabel={(option) => option.label}
                                    value={optionData.filter((option) =>
                                        values.options.includes(String(option.value))
                                    )}
                                    onChange={(event, newValue) => {
                                        const selectedValues = newValue.map((item) => String(item.value));
                                        setFieldValue("options", selectedValues);
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

                                {/* Preference Multi-Select */}
                                <Autocomplete
                                    multiple
                                    options={peferencesListData}
                                    getOptionLabel={(option) => option.pname}
                                    value={peferencesListData.filter((option) =>
                                        values.preference.includes(String(option.id))
                                    )}
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((item) => String(item.id));
                                        setFieldValue("preference", selectedIds);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="preference"
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
                                    Save Item Details
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}
        </Box>
    );
};

export default UserDetailsForm;


