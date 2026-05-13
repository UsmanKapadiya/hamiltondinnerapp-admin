import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  Home,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { Formik } from "formik";

import Header from "../../components/Header";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

import useRoomDetailsForm from "./useRoomDetailsForm";

const RoomDetailsForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {
    loading,
    roomDetails,
    showPassword,
    setShowPassword,
    initialValues,
    validationSchema,
    handleFormSubmit,
  } = useRoomDetailsForm();

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
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleFormSubmit}
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
                    gridColumn: isNonMobile
                      ? undefined
                      : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Unit Number"
                  name="room_name"
                  value={values.room_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.room_name &&
                    Boolean(errors.room_name)
                  }
                  helperText={
                    touched.room_name &&
                    errors.room_name
                  }
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Resident Name"
                  name="resident_name"
                  value={values.resident_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.resident_name &&
                    Boolean(errors.resident_name)
                  }
                  helperText={
                    touched.resident_name &&
                    errors.resident_name
                  }
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Occupancy"
                  name="occupancy"
                  value={values.occupancy}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.occupancy &&
                    Boolean(errors.occupancy)
                  }
                  helperText={
                    touched.occupancy &&
                    errors.occupancy
                  }
                  sx={{ gridColumn: "span 2" }}
                  inputProps={{
                    min: 1,
                    max: 10,
                    step: 1,
                  }}
                  onInput={(e) => {
                    if (e.target.value !== "") {
                      let val =
                        parseInt(e.target.value) || 1;

                      val = Math.max(
                        1,
                        Math.min(10, val)
                      );

                      e.target.value = val;
                    }
                  }}
                />

                <TextField
                  fullWidth
                  select
                  variant="filled"
                  label="Language Preference"
                  name="language"
                  value={values.language}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.language &&
                    Boolean(errors.language)
                  }
                  helperText={
                    touched.language &&
                    errors.language
                  }
                  sx={{ gridColumn: "span 2" }}
                >
                  <MenuItem value="0">
                    English
                  </MenuItem>

                  <MenuItem value="1">
                    Chinese
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  variant="filled"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  label="Password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.password &&
                    Boolean(errors.password)
                  }
                  helperText={
                    touched.password &&
                    errors.password
                  }
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
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
                  name="food_texture"
                  value={values.food_texture}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  multiline
                  rows={4}
                  label="Special Instructions"
                  name="special_instrucations"
                  value={
                    values.special_instrucations
                  }
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  multiline
                  rows={4}
                  label="Allergy Information"
                  name="allergy_info"
                  value={values.allergy_info}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 4" }}
                />

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ gridColumn: "span 4" }}
                >
                  <FormGroup>
                    <Typography
                      variant="subtitle1"
                      fontWeight="400"
                      mb="10px"
                    >
                      Status
                    </Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          color="secondary"
                          checked={
                            !!values.is_active
                          }
                          onChange={(e) =>
                            setFieldValue(
                              "is_active",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        values.is_active
                          ? "Active"
                          : "Inactive"
                      }
                    />
                  </FormGroup>
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="end"
                mt="20px"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
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
