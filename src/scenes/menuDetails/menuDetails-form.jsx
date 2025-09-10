import { Box, Button, TextField, useMediaQuery, Switch, FormGroup, FormControlLabel, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { CreateOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import CategoryServices from "../../services/categoryServices";
import MenuServices from "../../services/menuServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const validationSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
});

const MenuDetailsForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const optionsDetails = location.state;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);

  const [categoryListData, setCategoryListData] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedItems, setSelectedItems] = useState(optionsDetails?.items?.breakfast || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLunch, setSelectedLunch] = useState("");
  const [selectedLunchItems, setSelectedLunchItems] = useState(optionsDetails?.items?.lunch || []);
  const [lunchSearchTerm, setLunchSearchTerm] = useState("");
  const [selectedDinner, setSelectedDinner] = useState("");
  const [selectedDinnerItems, setSelectedDinnerItems] = useState(optionsDetails?.items?.dinner || []);
  const [dinnerSearchTerm, setDinnerSearchTerm] = useState("");

  // Memoized category options
  const BreakFastOptions = useMemo(
    () => categoryListData.filter((category) => category.type === 1),
    [categoryListData]
  );
  const LunchOptions = useMemo(
    () => categoryListData.filter((category) => category.type === 2),
    [categoryListData]
  );
  const DinnerOptions = useMemo(
    () => categoryListData.filter((category) => category.type === 3),
    [categoryListData]
  );

  // Memoized categorized items
  const itemList = useSelector((state) => state.itemState.item);
  const categorizedItems = useMemo(() => {
    return categoryListData.reduce((acc, category) => {
      acc[category.cat_name] = itemList.filter((item) => item.cat_id === category.id);
      return acc;
    }, {});
  }, [categoryListData, itemList]);

  // Debounce search terms for performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [debouncedLunchSearchTerm, setDebouncedLunchSearchTerm] = useState(lunchSearchTerm);
  const [debouncedDinnerSearchTerm, setDebouncedDinnerSearchTerm] = useState(dinnerSearchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedLunchSearchTerm(lunchSearchTerm), 300);
    return () => clearTimeout(handler);
  }, [lunchSearchTerm]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedDinnerSearchTerm(dinnerSearchTerm), 300);
    return () => clearTimeout(handler);
  }, [dinnerSearchTerm]);

  // Fetch categories once
  useEffect(() => {
    const getCategoryListData = async () => {
      try {
        const response = await CategoryServices.getCategoryList();
        setCategoryListData(response?.data);
      } catch (error) {
        console.error("Error fetching menu list:", error);
      }
    };
    getCategoryListData();
  }, []);

  // Set default selected categories
  useEffect(() => {
    if (categoryListData.length > 0) {
      if (BreakFastOptions.length > 0 && !selected) setSelected(BreakFastOptions[0]?.cat_name);
      if (LunchOptions.length > 0 && !selectedLunch) setSelectedLunch(LunchOptions[0]?.cat_name);
      if (DinnerOptions.length > 0 && !selectedDinner) setSelectedDinner(DinnerOptions[0]?.cat_name);
    }
  }, [categoryListData, BreakFastOptions, LunchOptions, DinnerOptions, selected, selectedLunch, selectedDinner]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    const renderData = categorizedItems[selected] || [];
    return renderData.filter((item) =>
      item?.item_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [categorizedItems, selected, debouncedSearchTerm]);

  const filtereLunchdData = useMemo(() => {
    const renderLunchData = categorizedItems[selectedLunch] || [];
    return renderLunchData.filter((item) =>
      item.item_name.toLowerCase().includes(debouncedLunchSearchTerm.toLowerCase())
    );
  }, [categorizedItems, selectedLunch, debouncedLunchSearchTerm]);

  const filtereDinnerData = useMemo(() => {
    const renderDinnerData = categorizedItems[selectedDinner] || [];
    return renderDinnerData.filter((item) =>
      item.item_name.toLowerCase().includes(debouncedDinnerSearchTerm.toLowerCase())
    );
  }, [categorizedItems, selectedDinner, debouncedDinnerSearchTerm]);

  // Memoized handlers
  const handleSelectCategory = useCallback((category) => {
    setSelected(category);
    setSearchTerm("");
  }, []);
  const handleSelectLunch = useCallback((category) => {
    setSelectedLunch(category);
    setLunchSearchTerm("");
  }, []);
  const handleSelectDinner = useCallback((category) => {
    setSelectedDinner(category);
    setDinnerSearchTerm("");
  }, []);
  const handleSelectItem = useCallback((item) => {
    setSelectedItems((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  }, []);
  const handleSelectLunchItem = useCallback((item) => {
    setSelectedLunchItems((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  }, []);
  const handleSelectDinnerItem = useCallback((item) => {
    setSelectedDinnerItems((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  }, []);

  const initialValues = useMemo(() => ({
    id: optionsDetails?.id,
    date: optionsDetails?.date || "",
    breakfast: optionsDetails?.items?.breakfast?.length > 0,
    lunch: optionsDetails?.items?.lunch?.length > 0,
    dinner: optionsDetails?.items?.dinner?.length > 0,
    BreakfastItems: optionsDetails?.items?.breakfast || [],
    lunchItems: optionsDetails?.items?.lunch || [],
    dinnerItems: optionsDetails?.items?.dinner || [],
  }), [optionsDetails]);

  // Optimized error handling
  const handleFormSubmit = async (values) => {
    setLoading(true);
    const { BreakfastItems, dinnerItems, lunchItems, breakfast, dinner, lunch, ...restValues } = values;
    const formData = {
      ...restValues,
      items: {
        breakfast: selectedItems,
        lunch: selectedLunchItems,
        dinner: selectedDinnerItems,
      },
      is_allday: false,
    };
    try {
      let response;
      if (formData?.id) {
        response = await MenuServices.updateMenus(formData.id, formData);
        toast.success("Menu updated successfully!");
      } else {
        response = await MenuServices.createMenu(formData);
        toast.success("Menu created successfully!");
      }
      if(response?.success === true) {
        navigate("/menu-details");
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

  return (
    <Box m="20px">
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={9999}
        >
          <CustomLoadingOverlay />
        </Box>
      )}
      <Header title={
        loading
          ? ""
          : optionsDetails?.id
            ? "Update Menu Detail"
            : "Add Menu Detail"
      }
        icon={<CreateOutlined />} Buttons={false} />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={values.date ? dayjs(values.date) : null}
                  onChange={(newValue) => {
                    setFieldValue("date", newValue ? newValue.format("YYYY-MM-DD") : "");
                  }}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "filled",
                      name: "date",
                      onBlur: handleBlur,
                      error: touched.date && Boolean(errors.date),
                      helperText: touched.date && errors.date,
                      sx: { gridColumn: "span 4" },
                    }
                  }}
                />
              </LocalizationProvider>
              <FormGroup sx={{ gridColumn: "span 1" }}>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={values.breakfast}
                      onChange={(e) => setFieldValue("breakfast", e.target.checked)}
                      name="breakfast"
                    />
                  }
                  label="Breakfast"
                />
              </FormGroup>
            </Box>
            {values.breakfast && (
              <>
                <Box mt="15px">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Menu Item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: "20px" }}
                  />
                </Box>
                <Box
                  display="grid"
                  gap="20px"
                  mt="15px"
                  gridTemplateColumns="repeat(8, 1fr)"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 2" }}
                    height={350}
                  >
                    <Box p="15px">
                      {/* Dynamically display categories with type 1 (BREAKFAST) */}
                      {categoryListData
                        .filter((category) => category.type === 1) // Filter categories with type 2
                        .map((category) => (
                          <Box
                            key={category.id}
                            onClick={() => handleSelectCategory(category.cat_name)} // Use category name for selection
                            sx={{
                              cursor: "pointer",
                              bgcolor: selected === category.cat_name ? colors.gray[800] : "transparent",
                              p: "10px",
                              borderRadius: "8px",
                              transition: "background-color 0.3s",
                            }}
                          >
                            <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                              {category.cat_name}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(3, 1fr)"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 6" }}
                    height={350}
                    overflow='auto'
                  >
                    {filteredData.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor={selectedItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                        p="10px"
                        borderRadius="8px"
                        color={selectedItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                          height: "100px",
                        }}
                        onClick={() => handleSelectItem(item)} // Handle item selection
                      >
                        {item.item_name}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}
            <Box mt="20px">
              <FormGroup sx={{ gridColumn: "span 1" }}>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={values.lunch}
                      onChange={(e) => setFieldValue("lunch", e.target.checked)}
                      name="lunch"
                    />
                  }
                  label="Lunch"
                />
              </FormGroup>
            </Box>
            {/* LUNCH */}
            {values.lunch && (
              <>
                <Box mt="15px">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Menu Item..."
                    value={lunchSearchTerm}
                    onChange={(e) => setLunchSearchTerm(e.target.value)}
                    sx={{ mb: "20px" }}
                  />
                </Box>
                <Box
                  display="grid"
                  gap="20px"
                  mt="15px"
                  gridTemplateColumns="repeat(8, 1fr)"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 2" }}
                  >
                    <Box p="15px">
                      {/* Dynamically display categories with type 2 (BREAKFAST) */}
                      {categoryListData
                        .filter((category) => category.type === 2) // Filter categories with type 2
                        .map((category) => (
                          <Box
                            key={category.id}
                            onClick={() => handleSelectLunch(category.cat_name)} // Use category name for selection
                            sx={{
                              cursor: "pointer",
                              bgcolor: selectedLunch === category.cat_name ? colors.gray[800] : "transparent",
                              p: "10px",
                              borderRadius: "8px",
                              transition: "background-color 0.3s",
                            }}
                          >
                            <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                              {category.cat_name}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(3, 1fr)"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    height={350}
                    overflow="auto"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 6" }}
                  >

                    {filtereLunchdData.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor={selectedLunchItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                        p="10px"
                        borderRadius="8px"
                        color={selectedLunchItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                          height: "100px",
                        }}
                        onClick={() => handleSelectLunchItem(item)} // Handle item selection
                      >
                        {item.item_name}
                      </Box>
                    ))}

                  </Box>

                </Box>
              </>
            )}
            <Box mt="20px">
              <FormGroup sx={{ gridColumn: "span 1" }}>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={values.dinner}
                      onChange={(e) => setFieldValue("dinner", e.target.checked)}
                      name="Dinner"
                    />
                  }
                  label="Dinner"
                />
              </FormGroup>
            </Box>
            {/* Dinner */}
            {values.dinner && (
              <>
                <Box mt="15px">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Menu Item..."
                    value={dinnerSearchTerm}
                    onChange={(e) => setDinnerSearchTerm(e.target.value)}
                    sx={{ mb: "20px" }}
                  />
                </Box>
                <Box
                  display="grid"
                  gap="20px"
                  mt="15px"
                  gridTemplateColumns="repeat(8, 1fr)"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 2" }}
                  >
                    <Box p="15px">
                      {/* Dynamically display categories with type 3 (Dinner) */}
                      {categoryListData
                        .filter((category) => category.type === 3) // Filter categories with type 2
                        .map((category) => (
                          <Box
                            key={category.id}
                            onClick={() => handleSelectDinner(category.cat_name)} // Use category name for selection
                            sx={{
                              cursor: "pointer",
                              bgcolor: selectedDinner === category.cat_name ? colors.gray[800] : "transparent",
                              p: "10px",
                              borderRadius: "8px",
                              transition: "background-color 0.3s",
                            }}
                          >
                            <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
                              {category.cat_name}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                  <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(3, 1fr)"
                    bgcolor={colors.primary[400]}
                    p="20px"
                    height={350}
                    overflow="auto"
                    borderRadius="8px"
                    sx={{ gridColumn: "span 6" }}
                  >
                    {filtereDinnerData.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor={selectedDinnerItems.includes(item.id) ? colors?.primary[500] : "lightgray"} // Check if item.id is in selectedItems
                        p="10px"
                        borderRadius="8px"
                        color={selectedDinnerItems.includes(item.id) ? "white" : "black"} // Adjust color based on selection
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                          height: "100px",
                        }}
                        onClick={() => handleSelectDinnerItem(item)} // Handle item selection
                      >
                        {item.item_name}
                      </Box>
                    ))}
                    {/* {filtereDinnerData.map((item) => (
                                            <Box
                                                key={item.id}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bgcolor={selectedDinnerItems.some((selected) => selected.id === item.id) ? colors?.primary[500] : "lightgray"}
                                                p="10px"
                                                borderRadius="8px"
                                                color={selectedItems.some((selected) => selected.id === item.id) ? "white" : "black"}

                                                s sx={{
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s",
                                                    height: "100px",
                                                    // "&:hover": {
                                                    //     bgcolor: "lightblue",
                                                    // },
                                                }}
                                                onClick={() => handleSelectDinnerItem(item)}
                                            >
                                                {item.item_name}
                                            </Box>
                                        ))} */}
                  </Box>

                </Box>
              </>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="end"
              mt="20px"
            >
              <Button type="submit" color="secondary" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default MenuDetailsForm;
