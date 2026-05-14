import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import FormServices from "../../../services/formServices";

const useFormsAddUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set Details
  useEffect(() => {
    if (location.state) {
      setFormDetails(location.state?.selectedRow);
    }
    setLoading(false);
  }, [location.state]);

  // Initial Values
  const initialValues = useMemo(
    () => ({
      id: formDetails?.id || "",
      name: formDetails?.name || "",
      allow_print:
        !!formDetails?.allow_print,
      allow_mail:
        !!formDetails?.allow_mail,
    }),
    [formDetails]
  );

  // Submit
  const handleFormSubmit = useCallback(
    async (values, actions) => {
      setLoading(true);
      const formData = {
        ...values,
      };
      try {
        let response;
        // Update
        if (formData.id) {
          response = await FormServices.updatetFormsDetails(
              formData.id,
              formData
            );
          setFormDetails(response?.data);
          toast.success("Form updated successfully!");
        }

        // Create
        else {
          response = await FormServices.createFormsDetails(
              formData
            );

          toast.success("Form created successfully!");
          actions.resetForm({ values: initialValues,});
        }

        if (response?.success === true) {
          navigate("/forms");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to process form. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [initialValues, navigate]
  );

  return {
    loading,
    formDetails,
    initialValues,
    handleFormSubmit,
  };
};

export default useFormsAddUpdate;
