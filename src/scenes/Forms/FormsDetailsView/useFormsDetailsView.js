import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import FormServices from "../../../services/formServices";

const useFormsDetailsView = () => {
  const location = useLocation();

  const itemformsDetails = location.state;

  const [formsDetails, setFormsDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch Details
  const getFormsDetails = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await FormServices.getFormDetails(id);

      setFormsDetails(response?.data);
    } catch (error) {
      console.error("Error fetching form details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFormsDetails(itemformsDetails?.id);
  }, [getFormsDetails, itemformsDetails?.id]);

  return {
    formsDetails,
    loading,
  };
};

export default useFormsDetailsView;
