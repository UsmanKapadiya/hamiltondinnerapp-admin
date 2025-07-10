import {
  Box, Button, Checkbox, FormControlLabel, FormGroup,
  TextField, Typography, useMediaQuery, useTheme
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RoleServices from "../../services/roleServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { setPermissionList } from "../../redux/action/permissionAction";

// Yup validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  display_name: yup.string().required("Display Name is required"),
});

const RoleDetailsForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const userData = JSON.parse(localStorage.getItem('userData'));

  const [loading, setLoading] = useState(true);
  const [permissionsList, setPermissionsList] = useState([]);
  const [roleDetails, setRoleDetails] = useState({
    id: "",
    name: "",
    display_name: "",
    permissions: [],
  });

  // Load permissions and optionally role data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const permissionsRes = await RoleServices.getPermissionsList();
        const permissions = permissionsRes?.data || [];

        const role = location.state || {};
        const selectedPerms = role.permission_list?.map(p => p.id) || [];

        const updatedPermissionsList = permissions.map((perm) => ({
          ...perm,
          checked: selectedPerms.includes(perm.id),
        }));

        setPermissionsList(updatedPermissionsList);
        setRoleDetails({
          id: role.id || "",
          name: role.name || "",
          display_name: role.display_name || "",
          permissions: selectedPerms,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const handleFormSubmit = async (values, actions) => {
    const selectedPermissions = permissionsList
      .filter(item => item.checked)
      .map(item => item.id);

    const formData = { ...values, permissions: selectedPermissions };
    try {
      if (formData.id) {
        await RoleServices.updateRole(formData.id, formData);
        await fetchGetRoleById();
        toast.success("Role updated successfully!");
        navigate("/roles");
      } else {
        await RoleServices.createRole(formData);
        await fetchGetRoleById();
        toast.success("Role created successfully!");
        actions.resetForm();
        navigate("/roles");
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((message) => toast.error(message));
      } else {
        toast.error("Failed to process role. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGetRoleById = async () => {
    try {
      const response = await RoleServices.getRoleById(userData?.role_id);
      dispatch(setPermissionList(response?.data?.permission_list));
    } catch (error) {
      console.error("Error fetching role by ID:", error);
    }
  };

  const togglePermission = (id) => {
    setPermissionsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const selectAllPermissions = () => {
    setPermissionsList((prev) =>
      prev.map((item) => ({ ...item, checked: true }))
    );
  };

  const deselectAllPermissions = () => {
    setPermissionsList((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
  };

  return (
    <Box m="20px">
      <Header title={
        loading
           ? ""
            : roleDetails?.id
            ? "Update Role"
            : "Add Role"
      } icon={<LockOutlined />} Buttons={false} />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CustomLoadingOverlay />
        </Box>
      ) : (
        <Formik
          initialValues={roleDetails}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleFormSubmit}
        >
          {({
            values, errors, touched, handleBlur,
            handleChange, handleSubmit
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  label="Name"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Display Name"
                  name="display_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.display_name}
                  error={touched.display_name && Boolean(errors.display_name)}
                  helperText={touched.display_name && errors.display_name}
                  sx={{ gridColumn: "span 4" }}
                />
                <Typography variant="h5" fontWeight="600" color={colors.gray[100]} sx={{ gridColumn: "span 4" }}>
                  Permissions
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography
                  color={colors.blueAccent[100]}
                  variant="h6"
                  sx={{ cursor: "pointer" }}
                  onClick={selectAllPermissions}
                >
                  Select All /
                </Typography>
                <Typography
                  color={colors.blueAccent[100]}
                  variant="h6"
                  sx={{ cursor: "pointer" }}
                  onClick={deselectAllPermissions}
                >
                  Deselect All
                </Typography>
              </Box>

              <FormGroup sx={{ mt: 2 }}>
                {permissionsList.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={item.checked}
                        onChange={() => togglePermission(item.id)}
                        color="secondary"
                      />
                    }
                    label={item.display_name}
                  />
                ))}
              </FormGroup>

              <Box display="flex" justifyContent="flex-end" mt={4}>
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
