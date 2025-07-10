import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DvrOutlined } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { Autocomplete } from "@mui/material";
import { toast } from "react-toastify";

import Header from "../../components/Header";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import UserServices from "../../services/userServices";
import RoleServices from "../../services/roleServices";

const getValidationSchema = (isUpdate = false) =>
  yup.object().shape({
    name: yup.string().required("Name is required"),
    user_name: yup.string().required("User Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
      .string()
      .min(4, "Password must be at least 4 characters")
      .when([], {
        is: () => !isUpdate,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    role_id: yup.number().typeError("Role is required").required("Role is required"),
  });

const UserDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState([]);

  const user = location?.state?.selectedRow;

  useEffect(() => {
    setUserData(user || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await RoleServices.getRoleList();
      setRoles(response?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const initialValues = {
    id: userData?.id || "",
    name: userData?.name || "",
    user_name: userData?.user_name || "",
    email: userData?.email || "",
    password: "",
    avatar: userData?.avatar ? userData?.avatar : null,
    role: userData?.role || "",
    role_id: userData?.role_id || "",
    is_admin: userData?.is_admin || false,
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("user_name", values.user_name);
      formData.append("email", values.email);
      if (values.password) formData.append("password", values.password);
      formData.append("role", values.role);
      formData.append("role_id", values.role_id);
      formData.append("is_admin", values.is_admin);

      if (
        values.avatar &&
        values.avatar instanceof File &&
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(values.avatar.type)
      ) {
        formData.append("avatar", values.avatar);
      } else  {
        // formData.append("avatar", values.avatar);
      }
      if (values.id) formData.append("id", values.id);
      const response = values.id
        ? await UserServices.updatetUser(values.id, formData)
        : await UserServices.createUser(formData);

      if (!response || response.success === false) {
        const apiErrors = response?.errors;
        if (apiErrors) {
          Object.entries(apiErrors).forEach(([field, messages]) => {
            messages.forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error("Failed to process user. Please try again.");
        }
        return; // Stop here if error
      }

      toast.success(`User ${values.id ? "updated" : "created"} successfully!`);

      if (values.id) {
        setUserData(response?.data);
      }

      // Redirect to users screen after success
      navigate("/users");
    } catch (error) {
      console.error("Submission error:", error);
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, messages]) => {
          messages.forEach((msg) => toast.error(msg));
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
      <Header
        title={loading ? "" : userData?.id ? "Update User Detail" : "Add User Detail"}
        icon={<DvrOutlined />}
        Buttons={false}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CustomLoadingOverlay />
        </Box>
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={getValidationSchema(Boolean(userData?.id))}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
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
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "User Name", name: "user_name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                ].map(({ label, name, type }) => (
                  <TextField
                    key={name}
                    fullWidth
                    variant="filled"
                    type={type}
                    label={label}
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                    sx={{ gridColumn: "span 4" }}
                  />
                ))}

                {/* Avatar Upload */}
                {/* <TextField
                  fullWidth
                  type="file"
                  variant="filled"
                  label="Upload Avatar"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setFieldValue("avatar", e.currentTarget.files[0])
                  }
                  sx={{ gridColumn: "span 4" }}
                /> */}

                <Box sx={{ gridColumn: "span 4" }}>
                  <input
                    accept="image/jpeg, image/png, image/jpg, image/gif"
                    style={{ display: 'none' }}
                    id="avatar-upload" // <-- changed here
                    name="avatar"
                    type="file"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("avatar", file);
                        // Optionally, set a preview URL
                        setFieldValue("avatar_preview", URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="contained" component="span">
                      Upload Image
                    </Button>
                  </label>

                  {/* Show selected file name */}
                  {values.avatar && values.avatar.name && (
                    <Box mt={1}>
                      <span>Selected: {values.avatar.name}</span>
                    </Box>
                  )}

                  {/* Show image preview */}
                  <Box mt={2}>
                    {values.avatar && values.avatar instanceof File && (
                      <img
                        src={values.avatar_preview || URL.createObjectURL(values.avatar)}
                        alt="Preview"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    )}
                    {!values.avatar?.name && userData?.avatar && (
                      <img
                        src={values.avatar}
                        alt="Current"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Role Selector */}
                <Autocomplete
                  options={roles}
                  getOptionLabel={(opt) => opt.name}
                  value={roles.find((opt) => opt.id === values.role_id) || null}
                  onChange={(_, newValue) => {
                    setFieldValue("role_id", newValue?.id || "");
                    setFieldValue("role", newValue?.name || "");
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

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.is_admin}
                        onChange={(e) =>
                          setFieldValue("is_admin", e.target.checked)
                        }
                        name="is_admin"
                        color="secondary"
                      />
                    }
                    label="Is Admin"
                    sx={{ gridColumn: "span 4" }}
                  />
                </FormGroup>
              </Box>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button type="submit" variant="contained" color="secondary">
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
