import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Formik } from "formik";
import { DynamicFormOutlined } from "@mui/icons-material";
import { Header } from "../../../components";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useFormsAddUpdate from "./useFormsAddUpdate";
import { validationSchema } from "./forms.validation";

const FormsAddUpdate = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {
    loading,
    formDetails,
    initialValues,
    handleFormSubmit,
  } = useFormsAddUpdate();

  return (
    <Box m="20px">
      <Header
        title={
          formDetails?.id
            ? "Update Form Type"
            : "Add Form Type"
        }
        icon={<DynamicFormOutlined />}
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
          initialValues={initialValues}
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
                    gridColumn: isNonMobile
                      ? undefined
                      : "span 4",
                  },
                }}
              >
                {/* Name */}
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={
                    touched.name &&
                    Boolean(errors.name)
                  }
                  helperText={
                    touched.name && errors.name
                  }
                  sx={{ gridColumn: "span 4" }}
                />

                {/* Allow Print */}
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={values.allow_print}
                        onChange={(e) =>
                          setFieldValue(
                            "allow_print",
                            e.target.checked
                          )
                        }
                        name="allow_print"
                      />
                    }
                    label="Allow Print"
                  />
                </FormGroup>
              </Box>

              {/* Allow Mail */}
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={values.allow_mail}
                        onChange={(e) =>
                          setFieldValue(
                            "allow_mail",
                            e.target.checked
                          )
                        }
                        name="allow_mail"
                      />
                    }
                    label="Allow Mail"
                  />
                </FormGroup>
              </Box>

              {/* Submit */}
              <Box
                display="flex"
                justifyContent="end"
                mt="20px"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
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
