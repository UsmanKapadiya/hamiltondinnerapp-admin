import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useMenuDetailsList from "./useMenuDetailsList";
import MenuDetailsListView from "./MenuDetailsListView";

const MenuDetailsListController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Get all state and handlers from custom hook
  const menuListHook = useMenuDetailsList();

  return <MenuDetailsListView theme={theme} colors={colors} {...menuListHook} />;
};

export default MenuDetailsListController;
