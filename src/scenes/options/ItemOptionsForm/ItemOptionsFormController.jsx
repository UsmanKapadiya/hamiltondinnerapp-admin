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
import { DvrOutlined } from "@mui/icons-material";
import Header from "../../../components/Header";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useItemOptionsForm from "./useItemOptionsForm";

const ItemoptionsForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {
    loading,
    optionsDetails,
    initialValues,
    validationSchema,
    handleFormSubmit,
  } = useItemOptionsForm();

  return (
    <Box m="20px">
      <Header
        title={
          optionsDetails?.id
            ? "Update Menu Item Option"
            : "Add Menu Item Option"
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
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          enableReinitialize
          validationSchema={
            validationSchema
          }
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
                    gridColumn:
                      isNonMobile
                        ? undefined
                        : "span 4",
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
                  value={
                    values.option_name
                  }
                  name="option_name"
                  error={
                    touched.option_name &&
                    Boolean(
                      errors.option_name
                    )
                  }
                  helperText={
                    touched.option_name &&
                    errors.option_name
                  }
                  sx={{
                    gridColumn:
                      "span 4",
                  }}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Option Chinese Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={
                    values.option_name_cn
                  }
                  name="option_name_cn"
                  error={
                    touched.option_name_cn &&
                    Boolean(
                      errors.option_name_cn
                    )
                  }
                  helperText={
                    touched.option_name_cn &&
                    errors.option_name_cn
                  }
                  sx={{
                    gridColumn:
                      "span 4",
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={
                          values.is_paid_item
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "is_paid_item",
                            e.target.checked
                          )
                        }
                        name="is_paid_item"
                      />
                    }
                    label="Is Paid Item"
                  />
                </FormGroup>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="end"
                mt="20px"
              >
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Save Menu Item Option
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
