import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete, useTheme, Typography, Checkbox } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home, LockOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";
import { toast } from "react-toastify";
import { tokens } from "../../theme";
import { PermissionsList } from "../../data/mockData"



const validationSchema = yup.object().shape({
    name: yup.string().required("Option  Name is required"),
    display_name: yup.string().required("Option  Chinese Name is required"),
});


const RoleDetailsForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [optionsDetails, setOptionsDetails] = useState('')
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState(
        Object.keys(PermissionsList).reduce((acc, key) => {
            acc[key] = PermissionsList[key].map((item) => ({ ...item, checked: false }));
            acc[`${key}Checked`] = false;
            return acc;
        }, {})
    );
    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedOptionsDetails = location.state;
            setOptionsDetails(fetchedOptionsDetails);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [location.state])
    const initialValues = {
        id: optionsDetails?.id || "",
        name: optionsDetails?.name || "",
        display_name: optionsDetails?.display_name || "",
    };


    const handleParentCheckboxChange = (key) => {
        setPermissions((prev) => {
            const updated = { ...prev };
            updated[key] = updated[key].map((item) => ({
                ...item,
                checked: !prev[`${key}Checked`],
            }));
            updated[`${key}Checked`] = !prev[`${key}Checked`];
            return updated;
        });
    };

    const handleChildCheckboxChange = (key, index) => {
        setPermissions((prev) => {
            const updated = { ...prev };
            updated[key][index].checked = !updated[key][index].checked;
            updated[`${key}Checked`] = updated[key].every((item) => item.checked);
            return updated;
        });
    };

    const handleFormSubmit = async (values, actions) => {
        // setLoading(true)
        const formData = { ...values };
       console.log(formData)
       console.log(permissions)

        // try {
        //     let response;
        //     if (formData?.id) {
        //         // Update Options if ID is available
        //         response = await ItemServices.updatetOptionsDetails(formData.id, formData);
        //         setOptionsDetails(response?.data)
        //         toast.success("Item Options updated successfully!");
        //     } else {
        //         // Create Options if ID is not available
        //         response = await ItemServices.createOptionsDetails(formData);
        //         toast.success("Item Options created successfully!");
        //         actions.resetForm({
        //             values: initialValues,
        //         });
        //     }
        // } catch (error) {
        //     toast.error("Failed to process menu. Please try again.");
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleSelectAll = () => {
        setPermissions((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
                if (Array.isArray(updated[key])) {
                    updated[key] = updated[key].map((item) => ({ ...item, checked: true }));
                }
                updated[`${key}Checked`] = true;
            });
            return updated;
        });
    };
    
    const handleDeselectAll = () => {
        setPermissions((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((key) => {
                if (Array.isArray(updated[key])) {
                    updated[key] = updated[key].map((item) => ({ ...item, checked: false }));
                }
                updated[`${key}Checked`] = false;
            });
            return updated;
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Role" icon={<LockOutlined />} Buttons={false} />
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
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Display Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.display_name}
                                    name="display_name"
                                    error={touched.display_name && Boolean(errors.display_name)}
                                    helperText={touched.display_name && errors.display_name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <Typography color={colors.gray[100]} variant="h5" fontWeight="600" sx={{ gridColumn: "span 4" }} >
                                    Permission
                                </Typography>
                                <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ gridColumn: "span 4" }}>
                                    <Typography
                                        color={colors.blueAccent[100]}
                                        variant="h5"
                                        fontWeight="600"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => handleSelectAll()}
                                    >
                                        Select All /
                                    </Typography>
                                    <Typography
                                        color={colors.blueAccent[100]}
                                        variant="h5"
                                        fontWeight="600"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => handleDeselectAll()}
                                    >
                                        &nbsp;Deselect All
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="column" sx={{ gridColumn: "span 4" }}>
                                {Object.keys(PermissionsList).map((key) => (
                                    <FormGroup key={key} sx={{ mb: 2 }}> {/* Add margin between groups */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={permissions[`${key}Checked`]}
                                                    onChange={() => handleParentCheckboxChange(key)}
                                                    color="secondary"
                                                />
                                            }
                                            label={key.charAt(0).toUpperCase() + key.slice(1)} 
                                        />
                                        <Box ml={4} display="flex" flexDirection="column">
                                            {permissions[key].map((item, index) => (
                                                <FormControlLabel
                                                    key={item.key}
                                                    control={
                                                        <Checkbox
                                                            checked={item.checked}
                                                            onChange={() => handleChildCheckboxChange(key, index)}
                                                            color="secondary"
                                                        />
                                                    }
                                                    label={item.label}
                                                />
                                            ))}
                                        </Box>
                                    </FormGroup>
                                ))}
                            </Box>
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
            )}
        </Box>
    );
};

export default RoleDetailsForm;