import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { SettingsOutlined } from "@mui/icons-material";

import { Header } from "../../components";
import { tokens } from "../../theme";
import useSetting from "./useSetting";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const validationSchema = yup.object({});

// Centralized field config
const FIELD_CONFIG = [
  { label: "Breakfast Guidelines", name: "breakfast_guideline" },
  { label: "Breakfast Guidelines Chinese", name: "breakfast_guideline_cn" },
  { label: "Lunch Guidelines", name: "lunch_guideline" },
  { label: "Lunch Guidelines Chinese", name: "lunch_guideline_cn" },
  { label: "Dinner Guidelines", name: "dinner_guideline" },
  { label: "Dinner Guidelines Chinese", name: "dinner_guideline_cn" },
];

const SettingController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { initialValues, handleSubmit, permissions } = useSetting();
  const { canAdd, canEdit, canBrowse } = permissions;

  // Cleaner reusable renderer
  const renderField = (field, formik) => {
    const { label, name } = field;
    const { values, handleChange, handleBlur, errors, touched } = formik;

    return (
      <Box
        key={name}
        display="grid"
        gap="20px"
        mt="20px"
        gridTemplateColumns="repeat(12, 1fr)"
      >
        <Box display="flex" flexDirection="column" sx={{ gridColumn: "span 12" }}>
          <Typography color={colors.gray[100]} mb="10px" fontWeight="500">
            {label}
          </Typography>

          <TextField
            fullWidth
            variant="filled"
            multiline
            rows={4}
            name={name}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={!canAdd && !canEdit}
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiInputBase-input": {
                color: colors.gray[100],
              },
            }}
          />
        </Box>
      </Box>
    );
  };

  if (!canBrowse) {
    return (
      <NoPermissionMessage
        title="You do not have permission to Setting."
        message="Please contact your administrator."
      />
    );
  }

  return (
    <Box m="20px">
      <Header title="Settings" icon={<SettingsOutlined />} />

      <Box
        mt="40px"
        sx={{
          "& .MuiFilledInput-root": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiInputBase-input": {
            color: colors.gray[100],
          },
        }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              {/* Loop instead of repetition */}
              {FIELD_CONFIG.map((field) =>
                renderField(field, formik)
              )}

              {(canAdd || canEdit) && (
                <Box display="flex" justifyContent="flex-end" mt="20px">
                  <Button type="submit" variant="contained" color="secondary">
                    Save Site Settings
                  </Button>
                </Box>
              )}
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SettingController;
