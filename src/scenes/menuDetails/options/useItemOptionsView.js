import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ItemServices from "../../../services/itemServices";

const useItemOptionsView = () => {
  const [optionsDetails, setOptionsDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const itemOptionsDetails = location.state;

  const getOptionsDetails = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await ItemServices.getOptionDetails(id);
      setOptionsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching option details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOptionsDetails(itemOptionsDetails?.id);
  }, [getOptionsDetails, itemOptionsDetails?.id]);

  return {
    optionsDetails,
    loading,
  };
};

export default useItemOptionsView;
