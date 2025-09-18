import { Box, Typography, useTheme, Button, Tabs, Tab, useMediaQuery, TextField, Icon, Autocomplete } from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { SettingsOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import SettingServices from "../../services/settingServices";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const CustomTabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const validationSchema = yup.object().shape({
  // siteGuidelines: yup.string().required("Site Guidelines are required"),
  // siteGuidelinesChinese: yup.string().required("Site Guidelines (Chinese) are required"),

  // Validation Commented
  // breakfast_guideline: yup.string().required("BreakFast Guidelines are required"),
  // breakfast_guideline_cn: yup.string().required("BreakFast Guidelines (Chinese) are required"),
  // lunch_guideline: yup.string().required("Lunch Guidelines are required"),
  // lunch_guideline_cn: yup.string().required("Lunch Guidelines (Chinese) are required"),
  // dinner_guideline: yup.string().required("Dinner Guidelines are required"),
  // dinner_guideline_cn: yup.string().required("Dinner Guidelines (Chinese) are required"),
});

const Setting = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(0);
  const [setting, setSetting] = useState([])
  const [loading, setLoading] = useState(false);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Add this state to hold your initial values
  // const [initialValues, setInitialValues] = useState({
  //   siteGuidelines: "",
  //   siteGuidelinesChinese: "",
  // });
  const [initialValues, setInitialValues] = useState({
    breakfast_guideline: "",
    breakfast_guideline_cn: "",
    lunch_guideline: "",
    lunch_guideline_cn: "",
    dinner_guideline: "",
    dinner_guideline_cn: "",
  });

  // Memoize permissions for performance
  const canAdd = useMemo(() => hasPermission(permissionList, "add_Settings"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_Settings"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_Settings"), [permissionList]);
  const canBrowseRoom = useMemo(() => hasPermission(permissionList, "browse_Settings"), [permissionList]);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SettingServices.getSettings();
      setSetting(response?.data)
      // const appMsg = response?.data.find(item => item.key === "site.app_msg");
      // const appMsgCn = response?.data.find(item => item.key === "site.app_msg_cn");

      const breakfastMsg = response?.data.find(item => item.key === "site.app_breakfast_msg");
      const breakfasMsgCn = response?.data.find(item => item.key === "site.app_breakfast_msg_cn");
      const lunchMsg = response?.data.find(item => item.key === "site.app_lunch_msg");
      const lunchMsgCn = response?.data.find(item => item.key === "site.app_lunch_msg_cn");
      const dinnerMsg = response?.data.find(item => item.key === "site.app_dinner_msg");
      const dinnerMsgCn = response?.data.find(item => item.key === "site.app_dinner_msg_cn");

      // console.log(appMsg?.value)
      // console.log(appMsgCn?.value)
      setInitialValues({
        // siteGuidelines: appMsg?.value || "test", //Chocolate Chip Cookies can served as snacks.
        // siteGuidelinesChinese: appMsgCn?.value || "dummy",//巧克力曲奇可以当零食吃。

        breakfast_guideline: breakfastMsg?.value || "",
        breakfast_guideline_cn: breakfasMsgCn?.value || "",
        lunch_guideline: lunchMsg?.value || "",
        lunch_guideline_cn: lunchMsgCn?.value || "",
        dinner_guideline: dinnerMsg?.value || "",
        dinner_guideline_cn: dinnerMsgCn?.value || "",
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
    // Find the original setting objects
    const breakfastMsg = setting?.find(item => item.key === "site.app_breakfast_msg");
    const breakfasMsgCn = setting?.find(item => item.key === "site.app_breakfast_msg_cn");
    const lunchMsg = setting?.find(item => item.key === "site.app_lunch_msg");
    const lunchMsgCn = setting.find(item => item.key === "site.app_lunch_msg_cn");
    const dinnerMsg = setting.find(item => item.key === "site.app_dinner_msg");
    const dinnerMsgCn = setting.find(item => item.key === "site.app_dinner_msg_cn");

    const payload = [
      breakfastMsg ? { ...breakfastMsg, value: values.breakfast_guideline } : null,
      breakfasMsgCn ? { ...breakfasMsgCn, value: values.breakfast_guideline_cn } : null,
      lunchMsg ? { ...lunchMsg, value: values.lunch_guideline } : null,
      lunchMsgCn ? { ...lunchMsgCn, value: values.lunch_guideline_cn } : null,
      dinnerMsg ? { ...dinnerMsg, value: values.dinner_guideline } : null,
      dinnerMsgCn ? { ...dinnerMsgCn, value: values.dinner_guideline_cn } : null,
    ].filter(Boolean);

    try {
      let response;
      if (payload.length > 0) {
        response = await SettingServices.updateSettings(payload);
        toast.success("Setting updated successfully!");
      } else {
        toast.error("No settings found to update.");
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
        addButton={canAdd && canBrowseRoom}
        deleteButton={canDelete && canBrowseRoom}
      />
      {canBrowseRoom ? (
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
                    {/* <Box
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
                          disabled={!canAdd && !canEdit}
                          sx={{ gridColumn: "span 2" }}
                        />
                      </Box>
                    </Box>
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
                          disabled={!canAdd && !canEdit}
                          error={touched.siteGuidelinesChinese && Boolean(errors.siteGuidelinesChinese)}
                          helperText={touched.siteGuidelinesChinese && errors.siteGuidelinesChinese}
                          sx={{ gridColumn: "span 2" }}
                        />
                      </Box>

                    </Box> */}
                    <>
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
                            BreakFast Guidelines
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_breakfast_msg')
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
                            value={values.breakfast_guideline}
                            name="breakfast_guideline"
                            error={touched.breakfast_guideline && Boolean(errors.breakfast_guideline)}
                            helperText={touched.breakfast_guideline && errors.breakfast_guideline}
                            disabled={!canAdd && !canEdit}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>
                      </Box>
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
                            BreakFast Guidelines Chinese
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_breakfast_msg_cn')
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
                            value={values.breakfast_guideline_cn}
                            name="breakfast_guideline_cn"
                            disabled={!canAdd && !canEdit}
                            error={touched.breakfast_guideline_cn && Boolean(errors.breakfast_guideline_cn)}
                            helperText={touched.breakfast_guideline_cn && errors.breakfast_guideline_cn}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>

                      </Box>
                      {/* Lunch */}
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
                            Lunch Guidelines
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_lunch_msg')
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
                            value={values.lunch_guideline}
                            name="lunch_guideline"
                            error={touched.lunch_guideline && Boolean(errors.lunch_guideline)}
                            helperText={touched.lunch_guideline && errors.lunch_guideline}
                            disabled={!canAdd && !canEdit}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>
                      </Box>
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
                            Lunch Guidelines Chinese
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_lunch_msg_cn')
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
                            value={values.lunch_guideline_cn}
                            name="lunch_guideline_cn"
                            disabled={!canAdd && !canEdit}
                            error={touched.lunch_guideline_cn && Boolean(errors.lunch_guideline_cn)}
                            helperText={touched.lunch_guideline_cn && errors.lunch_guideline_cn}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>
                      </Box>
                      {/* Dinner  */}
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
                            Dinner Guidelines
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_dinner_msg')
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
                            value={values.dinner_guideline}
                            name="dinner_guideline"
                            error={touched.dinner_guideline && Boolean(errors.dinner_guideline)}
                            helperText={touched.dinner_guideline && errors.dinner_guideline}
                            disabled={!canAdd && !canEdit}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>
                      </Box>
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
                            Dinner Guidelines Chinese
                            <Box
                              component="span"
                              ml="5px"
                              sx={{
                                color: `red`,
                                padding: "2px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              setting('site.app_dinner_msg_cn')
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
                            value={values.dinner_guideline_cn}
                            name="dinner_guideline_cn"
                            disabled={!canAdd && !canEdit}
                            error={touched.dinner_guideline_cn && Boolean(errors.dinner_guideline_cn)}
                            helperText={touched.dinner_guideline_cn && errors.dinner_guideline_cn}
                            sx={{ gridColumn: "span 2" }}
                          />
                        </Box>

                      </Box>
                    </>
                    {(canAdd || canEdit) && (
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
                    )}
                  </form>
                )}
              </Formik>
            </Box>
          </CustomTabPanel>
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to Setting."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default Setting;

