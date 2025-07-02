import { Box, Button, TextField, useMediaQuery, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  option_name: yup.string().required("Option Name is required"),
  option_name_cn: yup.string().required("Option Chinese Name is required"),
  is_paid_item: yup.boolean().required("Is Paid Item is required"),
});

const ItemoptionsForm = () => {
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [optionsDetails, setOptionsDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch option details from location.state
  useEffect(() => {
    if (location.state) {
      setOptionsDetails(location.state);
    }
    setLoading(false);
  }, [location.state]);

  // Memoize initial values to avoid recreation on every render
  const initialValues = useMemo(() => ({
    id: optionsDetails?.id || "",
    option_name: optionsDetails?.option_name || "",
    option_name_cn: optionsDetails?.option_name_cn || "",
    is_paid_item: !!optionsDetails?.is_paid_item,
  }), [optionsDetails]);

  // Memoize form submit handler
  const handleFormSubmit = useCallback(async (values, actions) => {
    setLoading(true);
    const formData = { ...values };
    try {
      let response;
      if (formData.id) {
        response = await ItemServices.updatetOptionsDetails(formData.id, formData);
        setOptionsDetails(response?.data);
        toast.success("Item Options updated successfully!");
      } else {
        response = await ItemServices.createOptionsDetails(formData);
        toast.success("Item Options created successfully!");
        actions.resetForm({ values: initialValues });
      }
    } catch (error) {
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [initialValues]);

  return (
    <Box m="20px">
      <Header title={optionsDetails?.id ? "Update Item Option" : "Add Item Option"} icon={<DvrOutlined />} Buttons={false} />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
          <CustomLoadingOverlay />
        </Box>
      ) : (
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

export default ItemoptionsForm;
