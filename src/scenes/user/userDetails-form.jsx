import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { useEffect, useState } from "react";
import RoleServices from "../../services/roleServices";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UserServices from "../../services/userServices";



const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    user_name: yup.string().required("User Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    // email_verified_at: yup
    //     .date()
    //     .nullable()
    //     .typeError("Invalid date format"),
    // avatar: yup
    //     .mixed()
    //     .nullable()
    //     .test("fileSize", "File size is too large", (value) =>
    //         value ? value.size <= 2 * 1024 * 1024 : true // Max size: 2MB
    //     )
    //     .test("fileType", "Unsupported file format", (value) =>
    //         value ? ["image/jpeg", "image/png"].includes(value.type) : true
    //     ),
    role_id: yup
        .number()
        .typeError("Role is required")
        .required("Role is required"),
});


const UserDetailsForm = () => {
    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState('');
    const [roleListData, setRoleListData] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const fetchedItemDetails = location.state?.selectedRow;
            setUserList(fetchedItemDetails);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [location.state])


    const initialValues = {
        id: userList?.id || "",
        name: userList?.name || "",
        user_name: userList?.user_name || "",
        email: userList?.email || "",
        password: userList?.password || "",
        // email_verified_at: userList?.email_verified_at || "",
        avatar: null,
        role: userList?.role || "",
        role_id: userList?.role_id || "",
    };

    useEffect(() => {
        roleList()
    }, [])
    const roleList = async (id) => {
        try {
            setLoading(true);
            const response = await RoleServices.getRoleList();
            setRoleListData(response?.data);
        } catch (error) {
            console.error("Error fetching menu list:", error);
        } finally {
            setLoading(false);
        }
    };
    // console.log("roleListData", roleListData);

    const handleFormSubmit = async (values) => {

        const payload = {
            ...values,
        };
        // console.log("Form Submitted:", payload);

        try {
            let response;
            if (payload?.id) {
                // Update User if ID is available
                response = await UserServices.updatetUser(payload.id, payload);
                toast.success("User updated successfully!");
            } else {
                // Create User if ID is not available
                response = await UserServices.createUser(payload);
                toast.success("User created successfully!");
            }
        } catch (error) {
            console.error("Error processing user:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    errors[key].forEach((message) => {
                        toast.error(message);
                    });
                });
            } else {
                toast.error("Failed to process user. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">

            <Header title={loading ? "" : userList?.id ? "Update User Detail" : "Add User Detail"} icon={<DvrOutlined />} Buttons={false} />
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
                                {/* Item Name */}
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

                                {/* Item Chinese Name */}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="User Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.user_name}
                                    name="user_name"
                                    error={
                                        touched.user_name && Boolean(errors.user_name)
                                    }
                                    helperText={touched.user_name && errors.user_name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="email"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={
                                        touched.email && Boolean(errors.email)
                                    }
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="password"
                                    label="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={
                                        touched.password && Boolean(errors.password)
                                    }
                                    helperText={touched.password && errors.password}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                {/* Remove  Email Verified At*/}
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Email Verified At"
                                        value={values.email_verified_at ? dayjs(values.email_verified_at) : null}
                                        onChange={(newValue) => setFieldValue("email_verified_at", newValue ? newValue.format("YYYY-MM-DD") : null)} // Use setFieldValue to update the form state
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                variant="filled"
                                                error={touched.email_verified_at && Boolean(errors.email_verified_at)}
                                                helperText={touched.email_verified_at && errors.email_verified_at}
                                                sx={{ gridColumn: "span 1" }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider> */}
                                {/* avatar Upload */}
                                <TextField
                                    fullWidth
                                    type="file"
                                    variant="filled"
                                    label="Upload avatar"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(event) =>
                                        setFieldValue("avatar", event.currentTarget.files[0])
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />

                                {/* Role Dropdown */}
                                <Autocomplete
                                    options={roleListData}
                                    getOptionLabel={(option) => option.name}
                                    value={
                                        roleListData.find((option) => option.id === values.role_id) || null
                                    }
                                    onChange={(event, newValue) => {
                                        setFieldValue("role_id", newValue ? newValue.id : 0);
                                        setFieldValue("role", newValue ? newValue.name : "");
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Role"
                                            variant="filled"
                                            error={touched.role_id && Boolean(errors.role_id)}
                                            helperText={touched.role_id && errors.role_id}
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
                                    Save User Details
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


