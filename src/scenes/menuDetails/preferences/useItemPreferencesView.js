import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ItemServices from "../../../services/itemServices";

const useItemPreferencesView = () => {
  const [preferencesDetails, setPreferencesDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const ItemPreferencesDetails = location.state?.id;

  const getPreferencesDetails = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await ItemServices.getPreferencesDetails(id);
      setPreferencesDetails(response?.data);
    } catch (error) {
      console.error("Error fetching preference details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPreferencesDetails(ItemPreferencesDetails);
  }, [ItemPreferencesDetails, getPreferencesDetails]);

  return {
    preferencesDetails,
    loading,
  };
};

export default useItemPreferencesView;
