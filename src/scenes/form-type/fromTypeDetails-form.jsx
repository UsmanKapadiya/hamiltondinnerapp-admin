import { Box, Button, TextField, useMediaQuery, MenuItem, Switch, FormGroup, FormControlLabel, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined, Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";



const validationSchema = yup.object().shape({
  formTypeName: yup.string().required("FormType Name is required"),
});


const fromTypeDetailsForm = () => {
  const location = useLocation();
  const formTypeDetails = location.state;
  console.log("formTypeDetails",formTypeDetails)
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialValues = {
    formTypeName: formTypeDetails?.formTypeName || "",
    allowPrint: formTypeDetails?.allowPrint || false,
    allowMail: formTypeDetails?.allowMail || false,
  };


  const handleFormSubmit = (values, actions) => {
    console.log("Form Submitted:", values);
    actions.resetForm({
      values: initialValues,
    });
  };

  return (
    <Box m="20px">
      <Header
        title="Add Form-Type Detail"
        icon={<DvrOutlined />}
        Buttons={false}
      />
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
                label="Form-Type Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.formTypeName}
                name="formTypeName"
                error={touched.formTypeName && Boolean(errors.formTypeName)}
                helperText={touched.formTypeName && errors.formTypeName}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box
              display="grid"
              gap="30px"
              mt="15px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={values.allowPrint}
                      onChange={(e) => setFieldValue("allowPrint", e.target.checked)}
                      name="allowPrint"
                    />
                  }
                  label="Allow Print"
                />
              </FormGroup>
            </Box>
            <Box
              display="grid"
              gap="30px"
              mt="15px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={values.allowMail}
                      onChange={(e) => setFieldValue("allowMail", e.target.checked)}
                      name="allowMail"
                    />
                  }
                  label="Allow Mail"
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
                Save Form-Type Details
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default fromTypeDetailsForm;