import React from "react";
import { Box, Button, TextField, useMediaQuery, FormHelperText, FormControlLabel, Radio, RadioGroup, FormControl, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { DvrOutlined } from "@mui/icons-material";
import { type } from "../../data/mockData";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const validationSchema = yup.object().shape({
  cat_name: yup.string().required("Course Name is required"),
  type: yup.string().required("Course Type is required"),
});

const CategoryDetailsFormView = ({
  categoryDetails,
  loading,
  filteredParentOptions,
  initialValues,
  handleFormSubmit,
  handleTypeChange,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box m="20px">
      <Header
        title={
          loading
            ? ""
            : categoryDetails?.id
              ? "Update Course Detail"
              : "Add Course Detail"
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
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                  label="Course Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cat_name}
                  name="cat_name"
                  error={touched.cat_name && Boolean(errors.cat_name)}
                  helperText={touched.cat_name && errors.cat_name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Course Chinese Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category_chinese_name}
                  name="category_chinese_name"
                  error={
                    touched.category_chinese_name &&
                    Boolean(errors.category_chinese_name)
                  }
                  helperText={
                    touched.category_chinese_name &&
                    errors.category_chinese_name
                  }
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl
                  component="fieldset"
                  sx={{ gridColumn: "span 4" }}
                  error={touched.type && Boolean(errors.type)}
                >
                  <Typography variant="subtitle1" fontWeight="400" mb="10px">
                    Select Meal Type
                  </Typography>
                  <RadioGroup
                    name="type"
                    value={String(values.type)}
                    onChange={(e) => handleTypeChange(e.target.value, values, setFieldValue, handleChange, e)}
                    row
                  >
                    {type.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={String(option.id)}
                        control={<Radio color="secondary" />}
                        label={option.type_name}
                      />
                    ))}
                  </RadioGroup>
                  {touched.type && errors.type && (
                    <FormHelperText>{errors.type}</FormHelperText>
                  )}
                </FormControl>
                {filteredParentOptions?.length > 0 && values.type && (
                  <FormControl component="fieldset" sx={{ gridColumn: "span 4" }}>
                    <Typography variant="subtitle1" fontWeight="400" mb="10px">
                      Select Parent Course
                    </Typography>
                    <RadioGroup
                      name="parent_id"
                      value={String(values.parent_id)}
                      onChange={(e) => setFieldValue("parent_id", e.target.value)}
                      row
                    >
                      {filteredParentOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={String(option.value)}
                          control={<Radio color="secondary" />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    {touched.parent_id && errors.parent_id && (
                      <FormHelperText error>{errors.parent_id}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="end"
                mt="20px"
              >
                <Button type="submit" color="secondary" variant="contained">
                  Save Course Details
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default CategoryDetailsFormView;
