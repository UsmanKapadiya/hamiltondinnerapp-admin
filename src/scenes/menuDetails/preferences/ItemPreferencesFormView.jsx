import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  pname: yup.string().required("Preference Name is required"),
});

const ItemPreferencesFormView = ({ initialValues, handleFormSubmit }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      enableReinitialize
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
              label="Preference Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.pname}
              name="pname"
              error={touched.pname && Boolean(errors.pname)}
              helperText={touched.pname && errors.pname}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Preference Chinese Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.pname_cn}
              name="pname_cn"
              error={touched.pname_cn && Boolean(errors.pname_cn)}
              helperText={touched.pname_cn && errors.pname_cn}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Save Menu Item Preference
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ItemPreferencesFormView;
