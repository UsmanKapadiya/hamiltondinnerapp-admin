import { Box, Button, TextField, useMediaQuery, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  option_name: yup.string().required("Option Name is required"),
  is_paid_item: yup.boolean().required("Is Paid Item is required"),
});

const ItemOptionsFormView = ({ initialValues, handleFormSubmit }) => {
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
              value={values.option_name}
              name="option_name"
              error={touched.option_name && Boolean(errors.option_name)}
              helperText={touched.option_name && errors.option_name}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Option Chinese Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.option_name_cn}
              name="option_name_cn"
              error={touched.option_name_cn && Boolean(errors.option_name_cn)}
              helperText={touched.option_name_cn && errors.option_name_cn}
              sx={{ gridColumn: "span 4" }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    checked={values.is_paid_item}
                    onChange={(e) => setFieldValue("is_paid_item", e.target.checked)}
                    name="is_paid_item"
                  />
                }
                label="Is Paid Item"
              />
            </FormGroup>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="end" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              Save Menu Item Option
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ItemOptionsFormView;
