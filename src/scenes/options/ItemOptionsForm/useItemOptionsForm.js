import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import ItemServices from "../../../services/itemServices";

const validationSchema = yup
  .object()
  .shape({
    option_name: yup
      .string()
      .required(
        "Option Name is required"
      ),

    is_paid_item: yup
      .boolean()
      .required(
        "Is Paid Item is required"
      ),
  });

const useItemOptionsForm = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [
    optionsDetails,
    setOptionsDetails,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (location.state) {
      setOptionsDetails(
        location.state
      );
    }

    setLoading(false);
  }, [location.state]);

  const initialValues = useMemo(
    () => ({
      id: optionsDetails?.id || "",

      option_name:
        optionsDetails?.option_name ||
        "",

      option_name_cn:
        optionsDetails?.option_name_cn ||
        "",

      is_paid_item:
        !!optionsDetails?.is_paid_item,
    }),
    [optionsDetails]
  );

  const handleFormSubmit =
    useCallback(
      async (values, actions) => {
        setLoading(true);

        const formData = {
          ...values,
        };

        try {
          let response;

          if (formData.id) {
            response =
              await ItemServices.updatetOptionsDetails(
                formData.id,
                formData
              );

            setOptionsDetails(
              response?.data
            );

            toast.success(
              "Item Options updated successfully!"
            );
          } else {
            response =
              await ItemServices.createOptionsDetails(
                formData
              );

            toast.success(
              "Item Options created successfully!"
            );

            actions.resetForm({
              values:
                initialValues,
            });
          }

          if (response?.success) {
            navigate(
              "/menu-item-options"
            );
          }
        } catch (error) {
          toast.error(
            "Failed to process options. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
      [initialValues, navigate]
    );

  return {
    loading,
    optionsDetails,
    initialValues,
    validationSchema,
    handleFormSubmit,
  };
};

export default useItemOptionsForm;
