import { Box } from "@mui/material";
import { Header } from "../../../components";
import { DvrOutlined } from "@mui/icons-material";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useItemOptionsForm from "./useItemOptionsForm";
import ItemOptionsFormView from "./ItemOptionsFormView";

const ItemoptionsForm = () => {
  const { optionsDetails, loading, initialValues, handleFormSubmit } = useItemOptionsForm();

  return (
    <Box m="20px">
      <Header 
        title={optionsDetails?.id ? "Update Menu Item Option" : "Add Menu Item Option"} 
        icon={<DvrOutlined />} 
        Buttons={false} 
      />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
          <CustomLoadingOverlay />
        </Box>
      ) : (
        <ItemOptionsFormView 
          initialValues={initialValues}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </Box>
  );
};

export default ItemoptionsForm;
