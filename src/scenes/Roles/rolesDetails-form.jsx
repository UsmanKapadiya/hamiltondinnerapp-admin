import { Box, Button, TextField, useMediaQuery, FormGroup, FormControlLabel, useTheme, Typography, Checkbox } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { LockOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import { tokens } from "../../theme";
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
            const fetchedOptionsDetails = location.state || {};
            setRoleDetails({
                id: fetchedOptionsDetails.id || "",
                name: fetchedOptionsDetails.name || "",
                display_name: fetchedOptionsDetails.display_name || "",
                permissions: fetchedOptionsDetails.permission_list?.map((perm) => perm.id) || [],
            });

            setPermissionsList((prev) =>
                prev.map((item) => ({
                    ...item,
                    checked: fetchedOptionsDetails.permission_list?.some(
                        (perm) => perm.id === item.id
                    ) || false,
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
                checked: roleDetails.permissions.includes(item.id),
            }));
            setPermissionsList(updatedPermissionsList);
        }
    }, [roleDetails.permissions, permissionsList]);

    const getAllPermission = async () => {
        try {
            setLoading(true);
            const response = await RoleServices.getPermissionsList();

            const permissionsWithChecked = response?.data.map((item) => ({
                ...item,
                checked: false,
            }));

            setPermissionsList(permissionsWithChecked);
        } catch (error) {
            console.error("Error fetching permissions list:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectPermissions = (data) => {
        setPermissionsList((prev) =>
            prev.map((item) =>
                item.id === data.id ? { ...item, checked: !item.checked } : item
            )
        );

        setRoleDetails((prev) => {
            const updatedPermissions = prev?.permissions?.includes(data.id)
                ? prev.permissions.filter((id) => id !== data.id)
                : [...(prev.permissions || []), data.id];

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

    setRoleDetails((prev) => ({
        ...prev,
        permissions: permissionsList.map((item) => item.id),
    }));
};


    const handleDeselectAllPermissions = () => {
    setPermissionsList((prev) =>
        prev.map((item) => ({
            ...item,
            checked: false,
        }))
    );

    setRoleDetails((prev) => ({
        ...prev,
        permissions: [],
    }));
};


    const handleFormSubmit = async (values, actions) => {
        const selectedPermissions = permissionsList
            .filter((item) => item.checked)
            .map((item) => item.id);

        const formData = {
            ...values,
            permissions: selectedPermissions,
        };

        console.log("Form Data:", formData);

        try {
            let response;
            if (formData.id) {
                response = await RoleServices.updateRole(formData.id, formData);
                toast.success("Role updated successfully!");
            } else {
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
                    enableReinitialize={!!roleDetails.id}
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