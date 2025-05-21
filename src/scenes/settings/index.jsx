import { Box, Typography, useTheme, Button, Tabs, Tab, useMediaQuery, TextField, Icon, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { SettingsOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import SettingServices from "../../services/settingServices";
import { toast } from "react-toastify";

const CustomTabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const validationSchema = yup.object().shape({
  siteGuidelines: yup.string().required("Site Guidelines are required"),
  siteGuidelinesChinese: yup.string().required("Site Guidelines (Chinese) are required"),
});

const Setting = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(0);
  const [setting, setSetting] = useState([])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchSettings();
  }, []);

  // Add this state to hold your initial values
  const [initialValues, setInitialValues] = useState({
    siteGuidelines: "",
    siteGuidelinesChinese: "",
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SettingServices.getSettings();
      setSetting(response?.data)
      const appMsg = response?.data.find(item => item.key === "site.app_msg");
      const appMsgCn = response?.data.find(item => item.key === "site.app_msg_cn");
      console.log(appMsg?.value)
      console.log(appMsgCn?.value)
      setInitialValues({
        siteGuidelines: appMsg?.value || "test", //Chocolate Chip Cookies can served as snacks.
        siteGuidelinesChinese: appMsgCn?.value || "dummy",//巧克力曲奇可以当零食吃。
      });
    } catch (error) {
      console.error("Error fetching room list:", error);
      toast.error("Failed to fetch room list. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFormSubmit = async (values, actions) => {
    setLoading(true);
    const appMsg = setting.find(item => item.key === "site.app_msg");
    const appMsgCn = setting.find(item => item.key === "site.app_msg_cn");

    const payload = [
      {
        "id": appMsg?.id || "",
        "key": "site.app_msg",
        "display_name": "Guidelines",
        "value": values?.siteGuidelines,
        "details": "The name of the application", //now static set because db in compalsary
        "type": "text", //now static set because db in compalsary
        "order": 1, //now static set because db in compalsary
        "group": "general" //now static set because db in compalsary
      }, {
        "id": appMsgCn?.id || "",
        "key": "site.app_msg_cn",
        "display_name": "Guidelines Chinese",
        "value": values?.siteGuidelinesChinese,
        "details": "The name of the application",
        "type": "text",
        "order": 1,
        "group": "general"
      }]
    console.log(payload)
    try {
      let response;
      if (appMsg?.id && appMsgCn?.id) {
        console.log("update call")
        response = await SettingServices.updateSettings(payload);
        toast.success("Setting updated successfully!");
      } else {
        console.log("create call")
        response = await SettingServices.createSettings(payload);
        toast.success("Setting created successfully!");
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((message) => toast.error(message));
      } else {
        toast.error("Failed to process menu. Please try again.");
      }
    } finally {
      setLoading(false);
    }
    // actions.resetForm({
    //   values: initialValues,
    // });
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
              enableReinitialize
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

                  </Box>

                  {/* Site Guidelines   */}
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(12, 1fr)"
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 12" }}
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
                    {/* Right Side Dropdown */}
                    {/* <Box
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
                    </Box> */}
                  </Box>
                  {/* Site Guidelines Chinese  */}
                  <Box
                    display="grid"
                    gap="20px"
                    mt="20px"
                    gridTemplateColumns="repeat(12, 1fr)" //8
                  >
                    <Box
                      display="flex"
                      sx={{ gridColumn: "span 12" }} // "span 6"
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
                    {/* Right Side Dropdown */}
                    {/* <Box
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
                    </Box> */}
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
      </Box>
    </Box>
  );
};

export default Setting;

