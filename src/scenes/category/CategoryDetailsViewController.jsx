import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useCategoryDetailsView from "./useCategoryDetailsView";
import CategoryDetailsView from "./categoryDetails-view";

const CategoryDetailsViewController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { categoryDetails, loading, getTypeName, getParentName } = useCategoryDetailsView();

  return (
    <CategoryDetailsView
      theme={theme}
      colors={colors}
      categoryDetails={categoryDetails}
      loading={loading}
      getTypeName={getTypeName}
      getParentName={getParentName}
    />
  );
};

export default CategoryDetailsViewController;
