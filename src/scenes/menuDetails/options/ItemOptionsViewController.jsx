import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useItemOptionsView from "./useItemOptionsView";
import ItemOptionsView from "./itemOptions-view";

const ItemOptionsViewController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { optionsDetails, loading } = useItemOptionsView();

  return (
    <ItemOptionsView
      theme={theme}
      colors={colors}
      optionsDetails={optionsDetails}
      loading={loading}
    />
  );
};

export default ItemOptionsViewController;
