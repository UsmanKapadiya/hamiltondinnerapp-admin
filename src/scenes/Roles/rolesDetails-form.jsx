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
import RoleServices from "../../services/roleServices";



const validationSchema = yup.object().shape({
    name: yup.string().required("Option  Name is required"),
    display_name: yup.string().required("Option  Chinese Name is required"),
});


const RoleDetailsForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [roleDetails, setRoleDetails] = useState({
        id: "",
        name: "",
        display_name: "",
        permissions: [], 
    }); const [loading, setLoading] = useState(true);
    const [permissionsList, setPermissionsList] = useState([]);

    useEffect(() => {
        getAllPermission();
    }, [])

   useEffect(() => {
    const timer = setTimeout(() => {
        console.log(location.state);
        const fetchedOptionsDetails = location.state || {};

        // Set role details
        setRoleDetails({
            id: fetchedOptionsDetails.id || "",
            name: fetchedOptionsDetails.name || "",
            display_name: fetchedOptionsDetails.display_name || "",
            permissions: fetchedOptionsDetails.permission_list?.map((perm) => perm.id) || [], // Extract permission IDs
        });

        // Update permissionsList to mark assigned permissions as checked
        setPermissionsList((prev) =>
            prev.map((item) => ({
                ...item,
                checked: fetchedOptionsDetails.permission_list?.some(
                    (perm) => perm.id === item.id
                ) || false, // Mark as checked if permission is assigned
            }))
        );

        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
}, [location.state]);
  useEffect(() => {
    if (roleDetails && permissionsList.length > 0) {
        const updatedPermissionsList = permissionsList.map((item) => ({
            ...item,
            checked: roleDetails.permissions?.includes(item.id) || false, // Mark as checked if the permission is assigned
        }));
        setPermissionsList(updatedPermissionsList);
    }
}, [roleDetails]);

    const getAllPermission = async () => {
    try {
        setLoading(true);
        const response = await RoleServices.getPermissionsList();
        console.log("Permissions List Response:", response);

        // Add `checked` property to each permission
        const permissionsWithChecked = response?.data.map((item) => ({
            ...item,
            checked: false, // Default to unchecked
        }));

        setPermissionsList(permissionsWithChecked);
    } catch (error) {
        console.error("Error fetching permissions list:", error);
    } finally {
        setLoading(false);
    }
};
    const handleSelectPermissions = (data) => {
        // Update the `checked` state in `permissionsList`
        setPermissionsList((prev) =>
            prev.map((item) =>
                item.id === data.id ? { ...item, checked: !item.checked } : item
            )
        );

        // Update `roleDetails.permissions` dynamically
        setRoleDetails((prev) => {
            const updatedPermissions = prev?.permissions?.includes(data.id)
                ? prev.permissions.filter((id) => id !== data.id) // Remove if exists
                : [...(prev.permissions || []), data.id]; // Add if not exists

            return {
                ...prev,
                permissions: updatedPermissions,
            };
        });
    };

    const handleSelectAllPermissions = () => {
        setPermissionsList((prev) =>
            prev.map((item) => ({
                ...item,
                checked: true,
            }))
        );
    };



    const handleDeselectAllPermissions = () => {
        setPermissionsList((prev) =>
            prev.map((item) => ({
                ...item,
                checked: false, // Set all items to unchecked
            }))
        );
    };


    const handleFormSubmit = async (values, actions) => {
        const selectedPermissions = permissionsList
            .filter((item) => item.checked) // Get only checked permissions
            .map((item) => item.id); // Extract their IDs

        const formData = {
            ...values,
            permissions: selectedPermissions, // Include selected permissions
        };

        console.log("Form Data:", formData);

        try {
            let response;
            if (formData.id) {
                // Update Role if ID is available
                response = await RoleServices.updateRole(formData.id, formData);
                toast.success("Role updated successfully!");
            } else {
                // Create Role if ID is not available
                response = await RoleServices.createRole(formData);
                toast.success("Role created successfully!");
                actions.resetForm({
                    values: roleDetails,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to process the request. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    console.log("Role Details:", roleDetails);
console.log("Permissions List:", permissionsList);
    // const handleFormSubmit = async (values, actions) => {
    //     // setLoading(true)
    //     const formData = { ...values };
    //     console.log(formData)
    //     console.log(permissions)

    //     // try {
    //     //     let response;
    //     //     if (formData?.id) {
    //     //         // Update Options if ID is available
    //     //         response = await ItemServices.updatetOptionsDetails(formData.id, formData);
    //     //         setOptionsDetails(response?.data)
    //     //         toast.success("Item Options updated successfully!");
    //     //     } else {
    //     //         // Create Options if ID is not available
    //     //         response = await ItemServices.createOptionsDetails(formData);
    //     //         toast.success("Item Options created successfully!");
    //     //         actions.resetForm({
    //     //             values: initialValues,
    //     //         });
    //     //     }
    //     // } catch (error) {
    //     //     toast.error("Failed to process menu. Please try again.");
    //     // } finally {
    //     //     setLoading(false);
    //     // }
    // };


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
                    initialValues={roleDetails}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                    validateOnChange={true}
                    enableReinitialize // Ensures the form reinitializes when `roleDetails` changes
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

                            </Box>
                            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ gridColumn: "span 4" }}>
                                <Typography
                                    color={colors.blueAccent[100]}
                                    variant="h5"
                                    fontWeight="600"
                                    sx={{ cursor: "pointer" }}
                                    onClick={handleSelectAllPermissions}
                                >
                                    Select All /
                                </Typography>
                                <Typography
                                    color={colors.blueAccent[100]}
                                    variant="h5"
                                    fontWeight="600"
                                    sx={{ cursor: "pointer" }}
                                    onClick={handleDeselectAllPermissions}
                                >
                                    &nbsp;Deselect All
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" sx={{ gridColumn: "span 4" }}>
                                <FormGroup sx={{ mb: 2 }}>
                                    <Box ml={4} display="flex" flexDirection="column">
                                        {permissionsList.map((item, index) => (
                                            <FormControlLabel
                                                key={item.id}
                                                control={
                                                    <Checkbox
                                                        checked={item.checked}
                                                        onChange={() => handleSelectPermissions(item)}
                                                        color="secondary"
                                                    />
                                                }
                                                label={item.display_name}
                                            />
                                        ))}
                                    </Box>
                                </FormGroup>
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