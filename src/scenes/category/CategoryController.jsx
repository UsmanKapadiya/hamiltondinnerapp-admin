import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useCategoryList from "./useCategoryList";
import CategoryListView from "./CategoryListView";

const CategoryController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const categoryState = useCategoryList();

  return (
    <CategoryListView
      theme={theme}
      colors={colors}
      {...categoryState}
    />
  );
};

export default CategoryController;
