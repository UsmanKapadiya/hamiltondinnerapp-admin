import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ItemServices from "../../../services/itemServices";

const useItemOptionsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [optionsDetails, setOptionsDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch option details from location.state
  useEffect(() => {
    if (location.state) {
      setOptionsDetails(location.state);
    }
    setLoading(false);
  }, [location.state]);

  // Memoize initial values to avoid recreation on every render
  const initialValues = useMemo(() => ({
    id: optionsDetails?.id || "",
    option_name: optionsDetails?.option_name || "",
    option_name_cn: optionsDetails?.option_name_cn || "",
    is_paid_item: !!optionsDetails?.is_paid_item,
  }), [optionsDetails]);

  const handleFormSubmit = useCallback(async (values, actions) => {
    setLoading(true);
    const formData = { ...values };
    try {
      let response;
      if (formData.id) {
        response = await ItemServices.updatetOptionsDetails(formData.id, formData);
        setOptionsDetails(response?.data);
        toast.success("Item Options updated successfully!");
      } else {
        response = await ItemServices.createOptionsDetails(formData);
        toast.success("Item Options created successfully!");
        actions.resetForm({ values: initialValues });
      }
      if (response?.success) {
        navigate("/menu-item-options");
      }
    } catch (error) {
      toast.error("Failed to process options. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [initialValues, navigate]);

  return {
    optionsDetails,
    loading,
    initialValues,
    handleFormSubmit,
  };
};

export default useItemOptionsForm;
