import { Box, Typography, useTheme, Button, Tabs, Tab, useMediaQuery, TextField, Icon, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataItems } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  DeleteOutlined,
  DvrOutlined,
  Home,
  SecurityOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";



const CustomTabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const validationSchema = yup.object().shape({
  siteTitle: yup.string().required("Site Title is required"),
  siteOptions: yup.string().required("Site Options is required"),

  siteDescription: yup.string().required("Site Description is required"),
  siteDescriptionOptions: yup.string().required("Site Description Options is required"),

  siteLogo: yup.string().nullable(), // Optional field
  siteLogoOptions: yup.string().required("Site Logo Options is required"),


  siteGoogleAnalyticId: yup.string().nullable(), // Optional field
  siteGoogleAnalyticIdOptions: yup.string().required("Site Googlea Analytics Options is required"),

  siteGuidelines: yup.string().required("Site Guidelines are required"),
  siteGuidelinesOptions: yup.string().required("Site Guidelines Options are required"),

  siteGuidelinesChinese: yup.string().required("Site Guidelines (Chinese) are required"),
  siteGuidelinesChineseOptions: yup.string().required("Site Guidelines (Chinese) Options are required"),
});
const adminValidationSchema = yup.object().shape({
  adminTitle: yup.string().required("admin Title is required"),
  adminOptions: yup.string().required("admin Options is required"),

  adminGoogleAnalyticId: yup.string().nullable(),
  adminGoogleAnalyticIdOptions: yup.string().required("Admin Googlea Analytics Options is required"),

  adminDescription: yup.string().required("admin Description is required"),
  adminDescriptionOptions: yup.string().required("admin Description Options is required"),

  adminLoader: yup.string().nullable(),
  adminLoaderOptions: yup.string().required("admin Loader Options is required"),

  adminLogo: yup.string().nullable(),
  adminLogoOptions: yup.string().required("admin Logo Options is required"),

  adminBgImage: yup.string().nullable(),
  adminBgImageOptions: yup.string().required("Admin Background Image Options is required")
});
const Setting = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const roomDetails = location.state;
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [value, setValue] = useState(0);
  const mockDataSiteRole = [{ id: 1, label: "Admin" }, { id: 2, label: "Site" }]
  const mockDataAdminRole = [{ id: 1, label: "Admin" }, { id: 2, label: "Site" }]

  const initialValues = {
    siteTitle: roomDetails?.siteTitle || "Dinning app",
    siteOptions: roomDetails?.siteOptions || "Site",

    siteDescription: roomDetails?.siteDescription || "Dinning app",
    siteDescriptionOptions: roomDetails?.siteDescriptionOptions || "Site",

    siteLogo: roomDetails?.siteLogo || "",
    siteLogoOptions: roomDetails?.siteLogoOptions || "Site",

    siteGoogleAnalyticId: roomDetails?.siteGoogleAnalyticId || "",
    siteGoogleAnalyticIdOptions: roomDetails?.siteGoogleAnalyticIdOptions || "Site",

    siteGuidelines: roomDetails?.siteGuidelines || "Chocolate Chip Cookies can served as snacks.",
    siteGuidelinesOptions: roomDetails?.siteGuidelinesOptions || "Site",

    siteGuidelinesChinese: roomDetails?.siteGuidelinesChinese || "巧克力曲奇可以当零食吃。",
    siteGuidelinesChineseOptions: roomDetails?.siteGuidelinesChineseOptions || "Site",
  };
  const adminInitialValues = {
    adminTitle: roomDetails?.adminTitle || "Dinning app",
    adminOptions: roomDetails?.adminOptions || "Admin",

    adminGoogleAnalyticId: roomDetails?.adminGoogleAnalyticId || "",
    adminGoogleAnalyticIdOptions: roomDetails?.adminGoogleAnalyticIdOptions || "Admin",

    adminDescription: roomDetails?.adminDescription || "Dinning app",
    adminDescriptionOptions: roomDetails?.adminDescriptionOptions || "Admin",

    adminLoader: roomDetails?.adminLoader || "",
    adminLoaderOptions: roomDetails?.adminLoaderOptions || "Admin",

    adminLogo: roomDetails?.adminLogo || "",
    adminLogoOptions: roomDetails?.adminLogoOptions || "Admin",

    adminBgImage: roomDetails?.adminBgImage || "",
    adminBgImageOptions: roomDetails?.adminBgImageOptions || "Admin",

  };

  const handleFormSubmit = (values, actions) => {
    console.log("Form Submitted:", values);
    actions.resetForm({
      values: initialValues,
    });
  };
  const handleAdminFormSubmit = (values, actions) => {
    console.log("Form Submitted:", values);
    actions.resetForm({
      values: adminInitialValues,
    });
  };



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box m="20px">
      <Header
        title="Settings"
        icon={<SettingsOutlined />}
        Buttons={false}
      />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <Box
          display="flex"
          gap="20px"
          mt="15px"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flext-start"
            justifyContent="flex-start"
            bgcolor={colors.primary[400]}
            p="20px"
            borderRadius="8px"
            flex="1"
          >
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
              How To Use:
            </Typography>
            <Typography color={colors.gray[100]} fontWeight="500" mt="10px">
              You can get the value of each setting anywhere on your site by calling{" "}
              <Box
                component="span"
                sx={{
                  color: `${colors.redAccent[900]}`,
                  backgroundColor: "white",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                setting('group.key')
              </Box>
            </Typography>
          </Box>
        </Box>
        {/* Tabs Section */}
        <Box mt="20px" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="settings tabs"
            TabIndicatorProps={{
              sx: { backgroundColor: colors.greenAccent[500] }, // Indicator color
            }}
          >
            <Tab
              label="Site"
              sx={{
                backgroundColor: value === 0 ? colors.primary[400] : "transparent", // Active tab background
                color: value === 0 ? colors.gray[100] : colors.gray[300], // Active tab text color
                borderRadius: "8px",
                transition: "0.3s",
              }}
            />
            {/* Admin Tabs Commented */}
            {/* <Tab
              label="Admin"
              sx={{
                backgroundColor: value === 1 ? colors.primary[400] : "transparent", // Active tab background
                color: value === 1 ? colors.gray[100] : colors.gray[300], // Active tab text color
                borderRadius: "8px",
                transition: "0.3s",
              }}
            /> */}

          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box>
            <Formik
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
                    gap="20px"
                    mt="15px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Site Title Input */}
                    {/* <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Site Title
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.title')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.siteTitle}
                        name="siteTitle"
                        error={touched.siteTitle && Boolean(errors.siteTitle)}
                        helperText={touched.siteTitle && errors.siteTitle}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box> */}

                    {/* Dropdown and Icons */}
                    {/* <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      /* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteOptions && Boolean(errors.siteOptions)}
                            helperText={touched.siteOptions && errors.siteOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box> */}
                  </Box>
                  {/* Site Description */}
                  {/* <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Site Description
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.description')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.siteDescription}
                        name="siteDescription"
                        error={touched.siteDescription && Boolean(errors.siteDescription)}
                        helperText={touched.siteDescription && errors.siteDescription}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteDescriptionOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteDescriptionOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteDescriptionOptions && Boolean(errors.siteDescriptionOptions)}
                            helperText={touched.siteDescriptionOptions && errors.siteDescriptionOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box> */}
                  {/* Site Logo */}
                  {/* <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Site Logo
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.logo')
                        </Box>
                      </Typography>

                      {values.siteLogo && (
                        <Box
                          component="img"
                          src={values.siteLogo}
                          alt="Uploaded Logo"
                          sx={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: colors.primary[400],
                          color: colors.gray[100],
                          "&:hover": {
                            backgroundColor: colors.primary[500],
                          },
                        }}
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFieldValue("siteLogo", e.target.result); // Set the uploaded image as base64
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteLogoOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteLogoOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteLogoOptions && Boolean(errors.siteLogoOptions)}
                            helperText={touched.siteLogoOptions && errors.siteLogoOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box> */}
                  {/* Site google Analytic  */}
                  {/* <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Google Analytics Tracking ID
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.google_analytics_tracking_id')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.siteGoogleAnalyticId}
                        name="siteGoogleAnalyticId"
                        error={touched.siteGoogleAnalyticId && Boolean(errors.siteGoogleAnalyticId)}
                        helperText={touched.siteGoogleAnalyticId && errors.siteGoogleAnalyticId}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteGoogleAnalyticIdOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteGoogleAnalyticIdOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteGoogleAnalyticIdOptions && Boolean(errors.siteGoogleAnalyticIdOptions)}
                            helperText={touched.siteGoogleAnalyticIdOptions && errors.siteGoogleAnalyticIdOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box> */}
                  {/* Site Guidelines   */}
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="flex-start"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Guidelines
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.app_msg')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        multiline // Enables textarea functionality
                        rows={4} // Sets the number of visible rows
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.siteGuidelines}
                        name="siteGuidelines"
                        error={touched.siteGuidelines && Boolean(errors.siteGuidelines)}
                        helperText={touched.siteGuidelines && errors.siteGuidelines}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-start"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                        mt="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteGuidelinesOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteGuidelinesOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteGuidelinesOptions && Boolean(errors.siteGuidelinesOptions)}
                            helperText={touched.siteGuidelinesOptions && errors.siteGuidelinesOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Site Guidelines Chinese  */}
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="flex-start"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Guidelines Chinese
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('site.app_msg_cn')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        multiline // Enables textarea functionality
                        rows={4} // Sets the number of visible rows
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.siteGuidelinesChinese}
                        name="siteGuidelinesChinese"
                        error={touched.siteGuidelinesChinese && Boolean(errors.siteGuidelinesChinese)}
                        helperText={touched.siteGuidelinesChinese && errors.siteGuidelinesChinese}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-start"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                        mt="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataSiteRole}

                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataSiteRole.find((option) => option.label === values.siteGuidelinesChineseOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("siteGuidelinesChineseOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.siteGuidelinesChineseOptions && Boolean(errors.siteGuidelinesChineseOptions)}
                            helperText={touched.siteGuidelinesChineseOptions && errors.siteGuidelinesChineseOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                    mt="20px"
                  >
                    <Button type="submit" color="secondary" variant="contained">
                      Save Site Settings
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={1}>
          <Box>
            <Formik
              onSubmit={handleAdminFormSubmit}
              initialValues={adminInitialValues}
              validationSchema={adminValidationSchema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleAdminSubmit,
                setFieldValue,
              }) => (
                <form onSubmit={handleAdminSubmit}>

                  <Box
                    display="grid"
                    gap="20px"
                    mt="15px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    /* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Admin Title
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.title')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.adminTitle}
                        name="adminTitle"
                        error={touched.adminTitle && Boolean(errors.adminTitle)}
                        helperText={touched.adminTitle && errors.adminTitle}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    {/* Dropdown and Icons
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminOptions && Boolean(errors.adminOptions)}
                            helperText={touched.adminOptions && errors.adminOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Admin google Analytic  *
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="10px" fontWeight="500">
                        Google Analytics Client ID (used for admin dashboard)
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.google_analytics_tracking_id')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.adminGoogleAnalyticId}
                        name="adminGoogleAnalyticId"
                        error={touched.adminGoogleAnalyticId && Boolean(errors.adminGoogleAnalyticId)}
                        helperText={touched.adminGoogleAnalyticId && errors.adminGoogleAnalyticId}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="center"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminGoogleAnalyticIdOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminGoogleAnalyticIdOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminGoogleAnalyticIdOptions && Boolean(errors.adminGoogleAnalyticIdOptions)}
                            helperText={touched.adminGoogleAnalyticIdOptions && errors.adminGoogleAnalyticIdOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Admin Description *
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="10px" fontWeight="500">
                        Admin Description
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.description')
                        </Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.adminDescription}
                        name="adminDescription"
                        error={touched.adminDescription && Boolean(errors.adminDescription)}
                        helperText={touched.adminDescription && errors.adminDescription}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-ends"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >

                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />


                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />


                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />

                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminDescriptionOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminDescriptionOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminDescriptionOptions && Boolean(errors.adminDescriptionOptions)}
                            helperText={touched.adminDescriptionOptions && errors.adminDescriptionOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Admin Loader Logo *
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Admin Loader
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.loader')
                        </Box>
                      </Typography>

                      {/* Uploaded Image Preview *
                      {values.adminLoader && (
                        <Box
                          component="img"
                          src={values.adminLoader}
                          alt="Uploaded Loader"
                          sx={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      {/* Image Uploader *
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: colors.primary[400],
                          color: colors.gray[100],
                          "&:hover": {
                            backgroundColor: colors.primary[500],
                          },
                        }}
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFieldValue("adminLoader", e.target.result); // Set the uploaded image as base64
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-start"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >

                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />


                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />


                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />

                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminLoaderOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminLoaderOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminLoaderOptions && Boolean(errors.adminLoaderOptions)}
                            helperText={touched.adminLoaderOptions && errors.adminLoaderOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Admin Logo *
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Admin Logo
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.logo')
                        </Box>
                      </Typography>

                      {/* Uploaded Image Preview *
                      {values.adminLogo && (
                        <Box
                          component="img"
                          src={values.adminLogo}
                          alt="Uploaded Logo"
                          sx={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      {/* Image Uploader *
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: colors.primary[400],
                          color: colors.gray[100],
                          "&:hover": {
                            backgroundColor: colors.primary[500],
                          },
                        }}
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFieldValue("adminLogo", e.target.result); // Set the uploaded image as base64
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-ss"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminLogoOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminLogoOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminLogoOptions && Boolean(errors.adminLogoOptions)}
                            helperText={touched.adminLogoOptions && errors.adminLogoOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>
                  {/* Admin Background Image *
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(8, 1fr)"
                  >
                    {/* Admin Title Input *
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 6" }}
                      flexDirection="column"
                      alignItems="flex-start" // Align content to the left
                      justifyContent="center"
                      flex={1}
                    >
                      <Typography color={colors.gray[100]} mb="20px" fontWeight="500">
                        Admin Background Image
                        <Box
                          component="span"
                          ml="5px"
                          sx={{
                            color: `red`,
                            padding: "2px 4px",
                            borderRadius: "4px",
                          }}
                        >
                          setting('admin.logo')
                        </Box>
                      </Typography>

                      {/* Uploaded Image Preview *
                      {values.adminBgImage && (
                        <Box
                          component="img"
                          src={values.adminBgImage}
                          alt="Uploaded Background Image"
                          sx={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      {/* Image Uploader *
                      <Button
                        variant="contained"
                        component="label"
                        sx={{
                          backgroundColor: colors.primary[400],
                          color: colors.gray[100],
                          "&:hover": {
                            backgroundColor: colors.primary[500],
                          },
                        }}
                      >
                        Upload Logo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFieldValue("adminBgImage", e.target.result); // Set the uploaded image as base64
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </Button>
                    </Box>

                    {/* Dropdown and Icons *
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end" // Align content to the left
                      justifyContent="flex-end"
                      sx={{ gridColumn: "span 2" }}
                      flex={1}
                    >
                      {/* Icons Right-Aligned *
                      <Box
                        display="flex"
                        justifyContent="flex-end" // Align buttons to the right
                        alignItems="flex-end"
                        gap="10px" // Small gap between buttons
                        mb="10px"
                      >
                        <ArrowUpwardOutlined sx={{ color: colors.gray[100] }} />
                        <ArrowDownwardOutlined sx={{ color: colors.gray[100] }} />
                        <DeleteOutlined sx={{ color: colors.redAccent[500] }} />
                      </Box>

                      {/* Dropdown *
                      <Autocomplete
                        fullWidth // Makes the dropdown full width
                        options={mockDataAdminRole}
                        getOptionLabel={(option) => option.label} // Ensure proper label rendering
                        value={mockDataAdminRole.find((option) => option.label === values.adminBgImageOptions) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("adminBgImageOptions", newValue ? newValue.label : ""); // Fix selection issue
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            error={touched.adminBgImageOptions && Boolean(errors.adminBgImageOptions)}
                            helperText={touched.adminBgImageOptions && errors.adminBgImageOptions}
                          />
                        )}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  </Box>


                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                    mt="20px"
                  >
                    <Button type="submit" color="secondary" variant="contained">
                      Save Admin Settings
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </CustomTabPanel> */}

      </Box>
    </Box>
  );
};

export default Setting;

