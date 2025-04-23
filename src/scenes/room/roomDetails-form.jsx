import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
    unitNumber: yup.string().required("Unit Number is required"),
    residentName: yup.string().required("Resident Name is required"),
    occupancy: yup
        .number()
        .typeError("Occupancy must be a number")
        .required("Occupancy is required"),
    languagePreference: yup.string().required("Language Preference is required"),
    foodTexture: yup.string().required("Food Texture is required"),
    specialInstructions: yup.string(),
    active: yup.boolean(),
});

const RoomDetailsForm = () => {
    const location = useLocation();
    const roomDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const initialValues = {
        unitNumber: roomDetails?.unitNumber || "",
        residentName: roomDetails?.resident_name || "",
        occupancy: roomDetails?.occupancy || "",
        languagePreference: roomDetails?.language_preference || "",
        foodTexture: roomDetails?.food_texture || "",
        specialInstructions: roomDetails?.special_instruction || "",
        active: roomDetails?.active || false,
      };

    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Room Detail" icon={<Home />} Buttons={false} />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
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
                                value={values.unitNumber}
                                name="unitNumber"
                                error={touched.unitNumber && Boolean(errors.unitNumber)}
                                helperText={touched.unitNumber && errors.unitNumber}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Resident Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.residentName}
                                name="residentName"
                                error={touched.residentName && Boolean(errors.residentName)}
                                helperText={touched.residentName && errors.residentName}
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
                            />
                            <TextField
                                fullWidth
                                select
                                variant="filled"
                                label="Language Preference"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.languagePreference}
                                name="languagePreference"
                                error={
                                    touched.languagePreference &&
                                    Boolean(errors.languagePreference)
                                }
                                helperText={
                                    touched.languagePreference && errors.languagePreference
                                }
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Chinese">Chinese</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Food Texture"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.foodTexture}
                                name="foodTexture"
                                error={touched.foodTexture && Boolean(errors.foodTexture)}
                                helperText={touched.foodTexture && errors.foodTexture}
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
                                value={values.specialInstructions}
                                name="specialInstructions"
                                error={
                                    touched.specialInstructions &&
                                    Boolean(errors.specialInstructions)
                                }
                                helperText={
                                    touched.specialInstructions && errors.specialInstructions
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
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={values.active}
                                                onChange={(e) => setFieldValue("active", e.target.checked)}
                                                name="active"
                                            />
                                        }
                                        label="Active"
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
                                Save Room Details
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default RoomDetailsForm;