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
  // item_image: yup
  // .mixed()
  // .test("fileType", "Unsupported File Format", (value) => {
  //   if (!value) return true;
  //   return ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(value.type);
  // }),

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
    item_image: itemDetails?.item_image ? itemDetails?.item_image : null,
  });

  const handleFormSubmit = async (values, { resetForm, setFieldValue }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("item_name", values.item_name);
    formData.append("item_chinese_name", values.item_chinese_name);
    formData.append("cat_id", values.cat_id);
    formData.append("is_allday", values.is_allday ? 1 : 0);
    formData.append("options", JSON.stringify(values.options));
    formData.append("preference", JSON.stringify(values.preference));
    if (
      values.item_image &&
      values.item_image instanceof File &&
      ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(values.item_image.type)
    ) {
      formData.append("item_image", values.item_image);
    } else {
      console.warn("Not a valid image file. Skipping append.");
    }

    if (values.id) {
      formData.append("id", values.id);
    }

    try {
      let response;
      if (values.id) {
        response = await ItemServices.updatetItems(values.id, formData);
        setItemDetails(response.data);
        toast.success("Items updated successfully!");
      } else {
        response = await ItemServices.createItems(formData);
        setItemDetails(response.data || null);
        toast.success("Items created successfully!");
        resetForm();
      }
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

                <Box sx={{ gridColumn: "span 4" }}>
                  <input
                    accept="image/jpeg, image/png, image/jpg, image/gif"
                    style={{ display: 'none' }}
                    id="item-image-upload"
                    name="item_image"
                    type="file"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("item_image", file);
                        // Optionally, set a preview URL
                        setFieldValue("item_image_preview", URL.createObjectURL(file));
                      }
                    }}
                  />
                  <label htmlFor="item-image-upload">
                    <Button variant="contained" component="span">
                      Upload Image
                    </Button>
                  </label>

                  {/* Show selected file name */}
                  {values.item_image && values.item_image.name && (
                    <Box mt={1}>
                      <span>Selected: {values.item_image.name}</span>
                    </Box>
                  )}

                  {/* Show image preview */}
                  <Box mt={2}>
                    {values.item_image && values.item_image instanceof File && (
                      <img
                        src={values.item_image_preview || URL.createObjectURL(values.item_image)}
                        alt="Preview"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    )}
                    {!values.item_image?.name && itemDetails?.item_image && (
                      <img
                        src={itemDetails.item_image}
                        alt="Current"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    )}
                  </Box>
                </Box>




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
