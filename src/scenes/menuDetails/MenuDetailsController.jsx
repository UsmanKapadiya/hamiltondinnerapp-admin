import { useTheme, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import useMenuDetails from "./useMenuDetails";
import MenuDetailsFormView from "./menuDetails-form";

const MenuDetailsController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const optionsDetails = location.state;
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Get all state and handlers from custom hook
  const menuDetailsHook = useMenuDetails(optionsDetails);

  return (
    <MenuDetailsFormView
      theme={theme}
      colors={colors}
      isNonMobile={isNonMobile}
      optionsDetails={optionsDetails}
      {...menuDetailsHook}
    />
  );
};

export default MenuDetailsController;
