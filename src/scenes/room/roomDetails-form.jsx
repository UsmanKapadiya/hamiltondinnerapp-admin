import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { Home } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import RoomServices from "../../services/roomServices";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  room_name: yup.string().required("Unit Number is required"),
  resident_name: yup.string().required("Resident Name is required"),
  occupancy: yup
    .number()
    .typeError("Occupancy must be a number")
    .required("Occupancy is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(3, "Password must be at least 3 characters"),
  language: yup.string().required("Language Preference is required"),
  // food_texture: yup.string().required("Food Texture is required"),
  // special_instrucations: yup.string(),
  is_active: yup.boolean(),
});

const RoomDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [roomDetails, setRoomDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRoomDetails(location.state || {});
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [location.state]);

  const initialValues = useMemo(
    () => ({
      id: roomDetails?.id || "",
      room_name: roomDetails?.room_name || "",
      resident_name: roomDetails?.resident_name || "",
      occupancy: roomDetails?.occupancy || "1",
      language: roomDetails?.language?.toString() || "1",
      password: roomDetails?.password,
      food_texture: roomDetails?.food_texture || "",
      special_instrucations: roomDetails?.special_instrucations || "",
      is_active: roomDetails?.is_active === 1 || roomDetails?.is_active === true || roomDetails?.id === undefined,
    }),
    [roomDetails]
  );

  const handleFormSubmit = useCallback(
    async (values, actions) => {
      setLoading(true);
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      };
      try {
        if (payload.id) {
          await RoomServices.updateRoomDetails(payload.id, payload);
          toast.success("Resident updated successfully!");
        } else {
          await RoomServices.createRoomDetails(payload);
          toast.success("Resident created successfully!");
          actions.resetForm({ values: initialValues });
        }
        // After save, navigate to the room list to show latest data
        navigate("/resident-details");
      } catch (error) {
        toast.error("Failed to process resident. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [initialValues, navigate]
  );

  return (
    <Box m="20px">
      <Header
        title={
          loading
            ? ""
            : roomDetails?.id
              ? "Update Resident Detail"
              : "Add Resident Detail"
        }
        icon={<Home />}
        Buttons={false}
      />
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
          enableReinitialize
          validationSchema={validationSchema}
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
                  label="Unit Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.room_name}
                  name="room_name"
                  error={touched.room_name && Boolean(errors.room_name)}
                  helperText={touched.room_name && errors.room_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Resident Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.resident_name}
                  name="resident_name"
                  error={touched.resident_name && Boolean(errors.resident_name)}
                  helperText={touched.resident_name && errors.resident_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Occupancy"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupancy}
                  name="occupancy"
                  error={touched.occupancy && Boolean(errors.occupancy)}
                  helperText={touched.occupancy && errors.occupancy}
                  sx={{ gridColumn: "span 2" }}
                  inputProps={{ min: 1, max: 10, step: 1 }}
                  onInput={e => {
                    if (e.target.value !== "") {
                      let val = parseInt(e.target.value) || 1;
                      val = Math.max(1, Math.min(10, val));
                      e.target.value = val;
                    }
                  }}
                />
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  label="Language Preference"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.language}
                  name="language"
                  error={touched.language && Boolean(errors.language)}
                  helperText={touched.language && errors.language}
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="0">English</MenuItem>
                  <MenuItem value="1">Chinese</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        edge="end"
                        size="small"
                        sx={{ minWidth: 0, padding: 0 }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Food Texture"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.food_texture}
                  name="food_texture"
                  error={touched.food_texture && Boolean(errors.food_texture)}
                  helperText={touched.food_texture && errors.food_texture}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Special Instructions"
                  multiline
                  rows={4}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.special_instrucations}
                  name="special_instrucations"
                  error={
                    touched.special_instrucations &&
                    Boolean(errors.special_instrucations)
                  }
                  helperText={
                    touched.special_instrucations && errors.special_instrucations
                  }
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ gridColumn: "span 4" }}
                >
                  <FormGroup>
                    <Typography variant="subtitle1" fontWeight="400" mb="10px">
                      Status
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          color="secondary"
                          checked={!!values.is_active}
                          onChange={(e) =>
                            setFieldValue("is_active", e.target.checked)
                          }
                          name="is_active"
                        />
                      }
                      label={values.is_active ? "Active" : "Inactive"}
                    />
                  </FormGroup>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="end"
                mt="20px"
              >
                <Button type="submit" color="secondary" variant="contained">
                  Save Resident Details
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default RoomDetailsForm; 
