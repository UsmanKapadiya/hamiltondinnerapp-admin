import { Box, Button, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { CreateOutlined } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import MealTypeSection from "./components/MealTypeSection";
import _ from "lodash";

const validationSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
});

const MenuDetailsFormView = ({
  colors,
  isNonMobile,
  optionsDetails,
  loading,
  categoryListData,
  breakfastOptions,
  lunchOptions,
  dinnerOptions,
  selected,
  selectedItems,
  searchTerm,
  setSearchTerm,
  selectedLunch,
  selectedLunchItems,
  lunchSearchTerm,
  setLunchSearchTerm,
  selectedDinner,
  selectedDinnerItems,
  dinnerSearchTerm,
  setDinnerSearchTerm,
  filteredBreakfastData,
  filteredLunchData,
  filteredDinnerData,
  handleSelectCategory,
  handleSelectLunch,
  handleSelectDinner,
  handleSelectItem,
  handleSelectLunchItem,
  handleSelectDinnerItem,
  initialValues,
  handleFormSubmit,
}) => {

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
                  format="MM-DD-YYYY"
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
            </Box>

            <MealTypeSection
              mealType="breakfast"
              mealLabel="Breakfast"
              isEnabled={values.breakfast}
              onToggle={(e) => setFieldValue("breakfast", e.target.checked)}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              categories={_.filter(categoryListData, (category) => category.type === 1)}
              selectedCategory={selected}
              onSelectCategory={handleSelectCategory}
              filteredItems={filteredBreakfastData}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              colors={colors}
            />

            <MealTypeSection
              mealType="lunch"
              mealLabel="Lunch"
              isEnabled={values.lunch}
              onToggle={(e) => setFieldValue("lunch", e.target.checked)}
              searchTerm={lunchSearchTerm}
              onSearchChange={(e) => setLunchSearchTerm(e.target.value)}
              categories={_.filter(categoryListData, (category) => category.type === 2)}
              selectedCategory={selectedLunch}
              onSelectCategory={handleSelectLunch}
              filteredItems={filteredLunchData}
              selectedItems={selectedLunchItems}
              onSelectItem={handleSelectLunchItem}
              colors={colors}
            />

            <MealTypeSection
              mealType="dinner"
              mealLabel="Dinner"
              isEnabled={values.dinner}
              onToggle={(e) => setFieldValue("dinner", e.target.checked)}
              searchTerm={dinnerSearchTerm}
              onSearchChange={(e) => setDinnerSearchTerm(e.target.value)}
              categories={_.filter(categoryListData, (category) => category.type === 3)}
              selectedCategory={selectedDinner}
              onSelectCategory={handleSelectDinner}
              filteredItems={filteredDinnerData}
              selectedItems={selectedDinnerItems}
              onSelectItem={handleSelectDinnerItem}
              colors={colors}
            />

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

export default MenuDetailsFormView;
