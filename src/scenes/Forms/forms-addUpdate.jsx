import { Box, Button, TextField, useMediaQuery, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DynamicFormOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import FormServices from "../../services/formServices";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
});

const FormsAddUpdate = () => {
    const location = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch option details from location.state
    useEffect(() => {
        if (location.state) {
            setFormDetails(location.state?.selectedRow);
        }
        setLoading(false);
    }, [location.state]);
    // console.log(formDetails)
    // Memoize initial values to avoid recreation on every render
    const initialValues = useMemo(() => ({
        id: formDetails?.id || "",
        name: formDetails?.name || "",
        allow_print: !!formDetails?.allow_print,
        allow_mail: !!formDetails?.allow_mail,

    }), [formDetails]);

    // Memoize form submit handler
    const handleFormSubmit = useCallback(async (values, actions) => {
        setLoading(true);
        const formData = { ...values };
        // console.log(formData)
        try {
            let response;
            if (formData.id) {
                response = await FormServices.updatetFormsDetails(formData.id, formData);
                setFormDetails(response?.data);
                toast.success("Form updated successfully!");
            } else {
                response = await FormServices.createFormsDetails(formData);
                toast.success("Form created successfully!");
                actions.resetForm({ values: initialValues });
            }
        } catch (error) {
            toast.error("Failed to process forms. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [initialValues]);

    return (
        <Box m="20px">
            <Header title={formDetails?.id ? "Update Form Type" : "Add Form Type"} icon={<DynamicFormOutlined />} Buttons={false} />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
                    <CustomLoadingOverlay />
                </Box>
            ) : (
                <Formik
                    enableReinitialize
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnBlur
                    validateOnChange
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
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={values.allow_print}
                                                onChange={(e) => setFieldValue("allow_print", e.target.checked)}
                                                name="allow_print"
                                            />
                                        }
                                        label="Allow Print"
                                    />
                                </FormGroup>
                            </Box>
                            <Box>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                color="secondary"
                                                checked={values.allow_mail}
                                                onChange={(e) => setFieldValue("allow_mail", e.target.checked)}
                                                name="allow_mail"
                                            />
                                        }
                                        label="Allow Mail"
                                    />
                                </FormGroup>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="end" mt="20px">
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

export default FormsAddUpdate;
