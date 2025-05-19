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
import { useLocation } from "react-router-dom";
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
      .min(6, "Password must be at least 6 characters")
      .when([], {
        is: () => !isUpdate,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    role_id: yup.number().typeError("Role is required").required("Role is required"),
  });

const UserDetailsForm = () => {
  const location = useLocation();
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
    avatar: null,
    role: userData?.role || "",
    role_id: userData?.role_id || "",
    is_admin: userData?.is_admin || false,
  };

  const handleFormSubmit = async (values) => {
    const payload = { ...values };

    if (payload.id && !payload.password) delete payload.password;

    try {
      const response = payload.id
        ? await UserServices.updatetUser(payload.id, payload)
        : await UserServices.createUser(payload);

      toast.success(`User ${payload.id ? "updated" : "created"} successfully!`);
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
                <TextField
                  fullWidth
                  type="file"
                  variant="filled"
                  label="Upload Avatar"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setFieldValue("avatar", e.currentTarget.files[0])
                  }
                  sx={{ gridColumn: "span 4" }}
                />

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
