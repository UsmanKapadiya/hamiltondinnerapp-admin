import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
    preferencesName: yup.string().required("Option  Name is required"),
    preferencesChineseName: yup.string().required("Option  Chinese Name is required"),
    isPaidItem: yup.string().required("Is Paid Item is required"),

});


const ItemPreferencesForm = () => {
    const location = useLocation();
    const optionsDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const initialValues = {
        preferencesName: optionsDetails?.preferencesName || "",
        preferencesChineseName: optionsDetails?.preferencesChineseName || "",
    };


    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Item Preference" icon={<DvrOutlined />} Buttons={false} />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnBlur={true} // Enable validation on blur
                validateOnChange={true} // Enable validation on change
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
                                label="Preference name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.preferencesName}
                                name="preferencesName"
                                error={touched.preferencesName && Boolean(errors.preferencesName)}
                                helperText={touched.preferencesName && errors.preferencesName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Preference Chinese Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.preferencesChineseName}
                                name="preferencesChineseName"
                                error={touched.preferencesChineseName && Boolean(errors.preferencesChineseName)}
                                helperText={touched.preferencesChineseName && errors.preferencesChineseName}
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
                                Save
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default ItemPreferencesForm;