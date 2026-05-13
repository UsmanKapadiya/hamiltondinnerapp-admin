import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useItemPreferencesView from "./useItemPreferencesView";
import ItemPreferencesView from "./itemPreferences-view";

const ItemPreferencesViewController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { preferencesDetails, loading } = useItemPreferencesView();

  return (
    <ItemPreferencesView
      theme={theme}
      colors={colors}
      preferencesDetails={preferencesDetails}
      loading={loading}
    />
  );
};

export default ItemPreferencesViewController;
