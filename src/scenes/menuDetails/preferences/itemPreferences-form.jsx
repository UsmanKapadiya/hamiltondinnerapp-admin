import { Box } from "@mui/material";
import { Header } from "../../../components";
import { DvrOutlined } from "@mui/icons-material";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useItemPreferencesForm from "./useItemPreferencesForm";
import ItemPreferencesFormView from "./ItemPreferencesFormView";

const ItemPreferencesForm = () => {
  const { preferencesDetails, loading, initialValues, handleFormSubmit } = useItemPreferencesForm();

  return (
    <Box m="20px">
      <Header
        title={
          loading
            ? ""
            : preferencesDetails?.id
              ? "Update Menu Item Preference"
              : "Add Menu Item Preference"
        }
        icon={<DvrOutlined />} 
        Buttons={false} 
      />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
          <CustomLoadingOverlay />
        </Box>
      ) : (
        <ItemPreferencesFormView 
          initialValues={initialValues}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </Box>
  );
};

export default ItemPreferencesForm;
