import { Box, Button, TextField, useMediaQuery, FormGroup, FormControlLabel, Switch, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import ItemServices from "../../services/itemServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { useEffect, useState, useMemo } from "react";

const validationSchema = yup.object().shape({
  item_name: yup.string().required("Item Name is required"),
  item_chinese_name: yup.string().required("Item Chinese Name is required"),
  options: yup
    .array()
    .of(yup.string().required("Each option must be a string"))
    .min(1, "At least one option is required")
    .required("Options are required"),
  cat_id: yup
    .number()
    .typeError("Parent Id must be a number")
    .required("Parent Id is required"),
  is_allday: yup.boolean().required("Is All Day is required"),
  preference: yup
    .array()
    .of(yup.string().required("Each preference must be a string"))
    .min(1, "At least one preference is required")
    .required("Preference is required"),
});

const ItemDetailsForm = () => {
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState();

  // Use correct spelling for preferencesListData
  const categoryListData = location.state?.categoryListData || [];
  const optionsListData = location.state?.optionsList || [];
  const preferencesListData = location.state?.preferencesList || [];

  // Memoize options for Autocomplete
  const categoryData = useMemo(
    () =>
      categoryListData.map((category) => ({
        label: category.cat_name,
        value: category.id,
      })),
    [categoryListData]
  );

  const optionData = useMemo(
    () =>
      optionsListData.map((opt) => ({
        label: opt.option_name,
        value: opt.id,
      })),
    [optionsListData]
  );

  // Memoize preferences for Autocomplete
  const preferencesData = useMemo(
    () =>
      preferencesListData.map((pref) => ({
        label: pref.pname,
        value: String(pref.id),
        ...pref,
      })),
    [preferencesListData]
  );

  // Load item details if editing
  useEffect(() => {
    const fetchedItemDetails = location.state?.selectedRow;
    setItemDetails(fetchedItemDetails);
    setLoading(false);
  }, [location.state]);

  // Use function for initialValues to ensure correct values after async load
  const getInitialValues = () => ({
    id: itemDetails?.id || "",
    item_name: itemDetails?.item_name || "",
    item_chinese_name: itemDetails?.item_chinese_name || "",
    cat_id: itemDetails?.cat_id || 0,
    is_allday: itemDetails?.is_allday || false,
    options: (() => {
      try {
        return itemDetails?.options
          ? JSON.parse(itemDetails.options).map(String)
          : [];
      } catch {
        return [];
      }
    })(),
    preference: (() => {
      try {
        return itemDetails?.preference
          ? JSON.parse(itemDetails.preference).map(String)
          : [];
      } catch {
        return [];
      }
    })(),
    image: null,
  });

const handleFormSubmit = async (values, { resetForm, setFieldValue }) => {
  setLoading(true);
  const payload = {
    ...values,
    options: JSON.stringify(values.options),
    preference: JSON.stringify(values.preference),
  };

  try {
    if (payload?.id) {
      const updatedItems = await ItemServices.updatetItems(payload.id, payload);
      setItemDetails(updatedItems.data);
      toast.success("Items updated successfully!");
    } else {
      const created = await ItemServices.createItems(payload);
      setItemDetails(created.data || null);
      toast.success("Items created successfully!");
      resetForm();
    }
    setFieldValue("image", null);
  } catch (error) {
    console.error("Error processing menu:", error);
    toast.error("Failed to process menu. Please try again.");
  } finally {
    setLoading(false);
  }
};

return (
    <Box m="20px">
      <Header
        title={
          loading
            ? ""
            : itemDetails?.id
            ? "Update Item Detail"
            : "Add Item Detail"
        }
        icon={<DvrOutlined />}
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
          enableReinitialize
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
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
                {/* Item Name */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Item Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.item_name}
                  name="item_name"
                  error={touched.item_name && Boolean(errors.item_name)}
                  helperText={touched.item_name && errors.item_name}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Item Chinese Name */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Item Chinese Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.item_chinese_name}
                  name="item_chinese_name"
                  error={
                    touched.item_chinese_name && Boolean(errors.item_chinese_name)
                  }
                  helperText={touched.item_chinese_name && errors.item_chinese_name}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Category Dropdown */}
                <Autocomplete
                  options={categoryData}
                  getOptionLabel={(option) => option.label}
                  value={
                    categoryData.find((option) => option.value === values.cat_id) ||
                    null
                  }
                  onChange={(_, newValue) => {
                    setFieldValue("cat_id", newValue ? newValue.value : 0);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="filled"
                      error={touched.cat_id && Boolean(errors.cat_id)}
                      helperText={touched.cat_id && errors.cat_id}
                    />
                  )}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Is All Day Switch */}
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={values.is_allday}
                        onChange={(e) =>
                          setFieldValue("is_allday", e.target.checked)
                        }
                        name="is_allday"
                      />
                    }
                    label="Is All Day"
                  />
                </FormGroup>

                {/* Image Upload */}
                <TextField
                  fullWidth
                  type="file"
                  variant="filled"
                  label="Upload Image"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: "image/*" }}
                  onChange={(event) =>
                    setFieldValue("image", event.currentTarget.files[0])
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Options Multi-Select */}
                <Autocomplete
                  multiple
                  options={optionData}
                  getOptionLabel={(option) => option.label}
                  value={optionData.filter((option) =>
                    values.options.includes(String(option.value))
                  )}
                  onChange={(_, newValue) => {
                    const selectedValues = newValue.map((item) => String(item.value));
                    setFieldValue("options", selectedValues);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Options"
                      variant="filled"
                      error={touched.options && Boolean(errors.options)}
                      helperText={touched.options && errors.options}
                    />
                  )}
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Preference Multi-Select */}
                <Autocomplete
                  multiple
                  options={preferencesData}
                  getOptionLabel={(option) => option.label}
                  value={preferencesData.filter((option) =>
                    values.preference.includes(option.value)
                  )}
                  onChange={(_, newValue) => {
                    const selectedIds = newValue.map((item) => item.value);
                    setFieldValue("preference", selectedIds);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Preference"
                      variant="filled"
                      error={touched.preference && Boolean(errors.preference)}
                      helperText={touched.preference && errors.preference}
                    />
                  )}
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
                  Save Item Details
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default ItemDetailsForm;
