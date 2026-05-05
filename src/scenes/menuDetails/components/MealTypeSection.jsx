import { Box, TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import _ from "lodash";
import CategoryList from "./CategoryList";
import ItemsGrid from "./ItemsGrid";

const MealTypeSection = ({
  mealType,
  mealLabel,
  isEnabled,
  onToggle,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredItems,
  selectedItems,
  onSelectItem,
  colors,
}) => {
  return (
    <>
      <Box mt="20px">
        <FormGroup sx={{ gridColumn: "span 1" }}>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={isEnabled}
                onChange={onToggle}
                name={mealType}
              />
            }
            label={mealLabel}
          />
        </FormGroup>
      </Box>

      {isEnabled && (
        <>
          <Box mt="15px">
            <TextField
              fullWidth
              variant="outlined"
              label="Search Menu Item..."
              value={searchTerm}
              onChange={onSearchChange}
              sx={{
                mb: "20px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colors.gray[200],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.gray[200],
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colors.gray[200],
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colors.gray[200],
                },
              }}
            />
          </Box>

          <Box
            display="grid"
            gap="20px"
            mt="15px"
            sx={{
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(8, 1fr)",
              },
            }}
          >
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              colors={colors}
            />

            <ItemsGrid
              items={filteredItems}
              selectedItems={selectedItems}
              onSelectItem={onSelectItem}
              colors={colors}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default MealTypeSection;
