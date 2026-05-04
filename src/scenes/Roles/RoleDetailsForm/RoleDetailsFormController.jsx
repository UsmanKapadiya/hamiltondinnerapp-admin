import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  LockOutlined,
} from "@mui/icons-material";

import { Formik } from "formik";
import * as yup from "yup";

import Header from "../../../components/Header";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import { tokens } from "../../../theme";

import useRoleDetailsForm from "./useRoleDetailsForm";
import { getModuleLabel } from "./roleForm.utils";
import { getCommonStyles } from "../../../utils/themeStyles"; 

const schema = yup.object({
  name: yup.string().required("Name is required"),
});

const RoleDetailsForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const styles = getCommonStyles(colors); // ✅ added
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const {
    loading,
    initialValues,
    groupedPermissions,
    expanded,

    togglePermission,
    selectAll,
    deselectAll,
    handleAccordion,
    handleSubmit,
  } = useRoleDetailsForm();

  return (
    <Box
      m="20px"
      sx={{
        backgroundColor: colors.primary[500], // ✅ page background fix
        minHeight: "100vh",
      }}
    >
      <Header title="Role Form" icon={<LockOutlined />} />

      {loading ? (
        <CustomLoadingOverlay />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="20px">
                
                {/* ✅ Name Field */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={styles.filledInput} // ✅ FIXED
                />

                {/* ✅ Select Controls */}
                <Box display="flex" gap={2}>
                  <Typography
                    sx={{ cursor: "pointer", color: colors.blueAccent[100] }}
                    onClick={selectAll}
                  >
                    Select All /
                  </Typography>
                  <Typography
                    sx={{ cursor: "pointer", color: colors.blueAccent[100] }}
                    onClick={deselectAll}
                  >
                    Deselect All
                  </Typography>
                </Box>

                {/* ✅ Permissions */}
                {groupedPermissions.map(({ module, items }) => (
                  <Accordion
                    key={module}
                    expanded={expanded[module] ?? true}
                    onChange={handleAccordion(module)}
                    sx={{
                      mb: 2,
                      ...styles.accordion(theme, colors), // ✅ FIXED
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        expanded[module] ? (
                          <ExpandLessOutlined />
                        ) : (
                          <ExpandMoreOutlined />
                        )
                      }
                      sx={styles.accordionHeader(theme, colors)} // ✅ FIXED
                    >
                      <Typography fontWeight="bold">
                        {getModuleLabel(module)}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <FormGroup>
                        {items.map((p) => (
                          <FormControlLabel
                            key={p.id}
                            control={
                              <Checkbox
                                checked={p.checked}
                                onChange={() => togglePermission(p.id)}
                                color="secondary" // ✅ FIXED
                              />
                            }
                            label={p.display_name}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {/* ✅ Submit */}
                <Box textAlign="right">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Save Role
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default RoleDetailsForm;
