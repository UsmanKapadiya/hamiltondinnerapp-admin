import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  pname: yup.string().required("Preference Name is required"),
  pname_cn: yup.string().required("Preference Chinese Name is required"),
});

const ItemPreferencesForm = () => {
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);
  const [preferencesDetails, setPreferencesDetails] = useState(null);

  useEffect(() => {
    setPreferencesDetails(location.state || null);
    setLoading(false);
  }, [location.state]);

  const initialValues = useMemo(
    () => ({
      id: preferencesDetails?.id || "",
      pname: preferencesDetails?.pname || "",
      pname_cn: preferencesDetails?.pname_cn || "",
    }),
    [preferencesDetails]
  );

  const handleFormSubmit = async (values, actions) => {
    setLoading(true);
    try {
      let response;
      if (values.id) {
        response = await ItemServices.updatetPreferencesDetails(values.id, values);
        setPreferencesDetails(response?.data);
        toast.success("Item preference updated successfully!");
      } else {
        response = await ItemServices.createPreferencesDetails(values);
        toast.success("Item preference created successfully!");
        actions.resetForm({ values: initialValues });
      }
    } catch (error) {
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add Item Preference" icon={<DvrOutlined />} Buttons={false} />
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

export default ItemPreferencesForm;
