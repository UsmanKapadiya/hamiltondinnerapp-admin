import React, { useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Switch,
  useTheme,
} from "@mui/material";
import { DvrOutlined } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { Autocomplete } from "@mui/material";

import Header from "../../../components/Header";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import { tokens } from "../../../theme";

import useUserDetailsForm from "./useUserDetailsForm";

/* ---------------- VALIDATION ---------------- */
const getValidationSchema = (isUpdate = false) =>
  yup.object().shape({
    name: yup.string().required("Name is required"),
    user_name: yup.string().required("User Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().when([], {
      is: () => !isUpdate,
      then: (s) => s.required("Password is required"),
      otherwise: (s) => s.notRequired(),
    }),
    role_id: yup.number().required("Role is required"),
  });

const UserDetailsForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const fileRef = useRef(null);

  const { loading, userData, roles, handleSubmit } =
    useUserDetailsForm();

  const initialValues = {
    id: userData?.id || "",
    name: userData?.name || "",
    user_name: userData?.user_name || "",
    email: userData?.email || "",
    password: "",
    avatar: userData?.avatar || null,
    avatar_preview: null,
    avatar_removed: false,
    role: userData?.role || "",
    role_id: userData?.role_id || "",
    is_admin: userData?.is_admin || false,
  };

  return (
    <Box m="20px">
      <Header
        title={userData?.id ? "Update User" : "Add User"}
        icon={<DvrOutlined />}
        Buttons={false}
      />

      {loading ? (
        <CustomLoadingOverlay />
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={getValidationSchema(Boolean(userData?.id))}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
          }) => {
            /* ---------------- IMAGE FIX ---------------- */
            const avatarPreview = useMemo(() => {
              if (values.avatar_preview) return values.avatar_preview;

              if (values.avatar instanceof File) {
                return URL.createObjectURL(values.avatar);
              }

              if (typeof values.avatar === "string") {
                return values.avatar;
              }

              return null;
            }, [values.avatar, values.avatar_preview]);

            return (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="25px"
                  gridTemplateColumns="repeat(4, 1fr)"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  {/* TEXT FIELDS */}
                  {["name", "user_name", "email", "password"].map((f) => (
                    <TextField
                      key={f}
                      fullWidth
                      variant="filled"
                      type={f === "password" ? "password" : "text"}
                      label={f === "user_name" ? "User Name" : f}
                      name={f}
                      value={values[f]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[f] && Boolean(errors[f])}
                      helperText={touched[f] && errors[f]}
                      sx={{ gridColumn: "span 4" }}
                    />
                  ))}

                  {/* IMAGE UPLOAD */}
                  <Box sx={{ gridColumn: "span 4" }}>
                    <input
                      ref={fileRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setFieldValue("avatar", file);
                        setFieldValue(
                          "avatar_preview",
                          URL.createObjectURL(file)
                        );
                        setFieldValue("avatar_removed", false);
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={() => fileRef.current?.click()}
                      component="span"
                    >
                      Upload Image
                    </Button>

                    {avatarPreview && (
                      <Box mt={2}>
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #999",
                          }}
                        />

                        <Box mt={1}>
                          <Button
                            color="error"
                            onClick={() => {
                              setFieldValue("avatar", null);
                              setFieldValue("avatar_preview", null);
                              setFieldValue("avatar_removed", true);

                              // 🔥 FIX: allow re-upload after remove
                              if (fileRef.current) {
                                fileRef.current.value = "";
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* ROLE */}
                  <Autocomplete
                    options={roles}
                    getOptionLabel={(o) => o.name}
                    value={roles.find((r) => r.id === values.role_id) || null}
                    onChange={(_, v) => {
                      setFieldValue("role_id", v?.id || "");
                      setFieldValue("role", v?.name || "");
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" variant="filled" />
                    )}
                    sx={{ gridColumn: "span 4" }}
                  />

                  {/* SWITCH */}
                  <FormGroup sx={{ gridColumn: "span 4" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.is_admin}
                          onChange={(e) =>
                            setFieldValue("is_admin", e.target.checked)
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: colors.greenAccent[400],
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: colors.greenAccent[400],
                              },
                          }}
                        />
                      }
                      label="Is Admin"
                    />
                  </FormGroup>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"                   
                  >
                    Save User Details
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      )}
    </Box>
  );
};

export default UserDetailsForm;