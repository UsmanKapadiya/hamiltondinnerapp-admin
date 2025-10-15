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

const residentSchema = yup.object({
  resident_name: yup.string().required("Resident Name is required"),
  language: yup.string().required("Language Preference is required"),
  password: yup.string().required("Password is required").min(3, "Password must be at least 3 characters"),
  food_texture: yup.string(),
  special_instrucations: yup.string(),
});

const validationSchema = yup.object({
  room_name: yup.string().required("Unit Number is required"),
  occupancy: yup
    .number()
    .typeError("Occupancy must be a number")
    .required("Occupancy is required"),
  residents: yup.array().of(residentSchema),
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

  const initialValues = useMemo(() => {
    const occupancy = parseInt(roomDetails?.occupancy) || 1;
    const residents = [];
    for (let i = 0; i < occupancy; i++) {
      if (roomDetails?.residents && roomDetails.residents[i]) {
        residents.push({
          resident_name: roomDetails.residents[i].resident_name || "",
          language: roomDetails.residents[i].language?.toString() || "1",
          password: roomDetails.residents[i].password || "",
          food_texture: roomDetails.residents[i].food_texture || "",
          special_instrucations: roomDetails.residents[i].special_instrucations || "",
        });
      } else {
        residents.push({
          resident_name: "",
          language: "1",
          password: "",
          food_texture: "",
          special_instrucations: "",
        });
      }
    }
    return {
      id: roomDetails?.id || "",
      room_name: roomDetails?.room_name || "",
      occupancy: occupancy,
      residents,
      is_active: roomDetails?.is_active === 1 || roomDetails?.is_active === true || roomDetails?.id === undefined,
    };
  }, [roomDetails]);

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
                  type="number"
                  label="Occupancy"
                  onBlur={handleBlur}
                  onChange={e => {
                    let val = parseInt(e.target.value) || 1;
                    val = Math.max(1, Math.min(10, val));
                    handleChange({
                      target: {
                        name: "occupancy",
                        value: val,
                      },
                    });
                  }}
                  value={values.occupancy}
                  name="occupancy"
                  error={touched.occupancy && Boolean(errors.occupancy)}
                  helperText={touched.occupancy && errors.occupancy}
                  sx={{ gridColumn: "span 2" }}
                  inputProps={{ min: 1, max: 10, step: 1 }}
                />
                {/* Render resident sections dynamically */}
                {Array.from({ length: values.occupancy }).map((_, idx) => (
                  <Box key={idx} sx={{ gridColumn: "span 4", border: "1px solid #eee", borderRadius: 2, p: 2, mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                      {`${idx + 1}${idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} resident`}
                    </Typography>
                    <Box display="grid" gap="20px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Resident Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.residents[idx]?.resident_name || ""}
                        name={`residents[${idx}].resident_name`}
                        error={touched.residents?.[idx]?.resident_name && Boolean(errors.residents?.[idx]?.resident_name)}
                        helperText={touched.residents?.[idx]?.resident_name && errors.residents?.[idx]?.resident_name}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        select
                        variant="filled"
                        label="Language Preference"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.residents[idx]?.language || "1"}
                        name={`residents[${idx}].language`}
                        error={touched.residents?.[idx]?.language && Boolean(errors.residents?.[idx]?.language)}
                        helperText={touched.residents?.[idx]?.language && errors.residents?.[idx]?.language}
                        sx={{ gridColumn: "span 2" }}
                      >
                        <MenuItem value="1">English</MenuItem>
                        <MenuItem value="0">Chinese</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.residents[idx]?.password || ""}
                        name={`residents[${idx}].password`}
                        error={touched.residents?.[idx]?.password && Boolean(errors.residents?.[idx]?.password)}
                        helperText={touched.residents?.[idx]?.password && errors.residents?.[idx]?.password}
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
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                        value={values.residents[idx]?.food_texture || ""}
                        name={`residents[${idx}].food_texture`}
                        error={touched.residents?.[idx]?.food_texture && Boolean(errors.residents?.[idx]?.food_texture)}
                        helperText={touched.residents?.[idx]?.food_texture && errors.residents?.[idx]?.food_texture}
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
                        value={values.residents[idx]?.special_instrucations || ""}
                        name={`residents[${idx}].special_instrucations`}
                        error={touched.residents?.[idx]?.special_instrucations && Boolean(errors.residents?.[idx]?.special_instrucations)}
                        helperText={touched.residents?.[idx]?.special_instrucations && errors.residents?.[idx]?.special_instrucations}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                ))}
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
