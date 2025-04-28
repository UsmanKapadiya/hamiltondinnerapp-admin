import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
    optionsName: yup.string().required("Option  Name is required"),
    optionsChineseName: yup.string().required("Option  Chinese Name is required"),
    isPaidItem: yup.string().required("Is Paid Item is required"),

});


const ItemoptionsForm = () => {
    const location = useLocation();
    const optionsDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const initialValues = {
        optionsName: optionsDetails?.optionsName || "",
        optionsChineseName: optionsDetails?.optionsChineseName || "",
        isPaidItem: optionsDetails?.isPaidItem || false,       
    };


    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Item Option" icon={<DvrOutlined />} Buttons={false} />
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
                                label="Option Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.optionsName}
                                name="optionsName"
                                error={touched.optionsName && Boolean(errors.optionsName)}
                                helperText={touched.optionsName && errors.optionsName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Option Chinese Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.optionsChineseName}
                                name="optionsChineseName"
                                error={touched.optionsChineseName && Boolean(errors.optionsChineseName)}
                                helperText={touched.optionsChineseName && errors.optionsChineseName}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            color="secondary"
                                            checked={values.isPaidItem}
                                            onChange={(e) => setFieldValue("isPaidItem", e.target.checked)}
                                            name="isPaidItem"
                                        />
                                    }
                                    label="Is Paid Item"
                                />
                            </FormGroup>                        
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

export default ItemoptionsForm;