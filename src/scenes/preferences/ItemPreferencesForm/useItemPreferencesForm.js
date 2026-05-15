import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";1
import { toast } from "react-toastify";
import ItemServices from "../../../services/itemServices";

const useItemPreferencesForm = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [
    preferencesDetails,
    setPreferencesDetails,
  ] = useState(null);

  useEffect(() => {
    setPreferencesDetails(
      location.state || null
    );

    setLoading(false);
  }, [location.state]);

  const initialValues = useMemo(
    () => ({
      id:
        preferencesDetails?.id || "",
      pname:
        preferencesDetails?.pname ||
        "",
      pname_cn:
        preferencesDetails?.pname_cn ||
        "",
    }),
    [preferencesDetails]
  );

  const handleFormSubmit =
    useCallback(
      async (values, actions) => {
        setLoading(true);

        try {
          let response;

          if (values.id) {
            response =
              await ItemServices.updatetPreferencesDetails(
                values.id,
                values
              );

            setPreferencesDetails(
              response?.data
            );

            toast.success(
              "Item preference updated successfully!"
            );
          } else {
            response =
              await ItemServices.createPreferencesDetails(
                values
              );

            toast.success(
              "Item preference created successfully!"
            );

            actions.resetForm({
              values: initialValues,
            });
          }

          if (response?.success) {
            navigate(
              "/menu-item-preferences"
            );
          }
        } catch (error) {
          toast.error(
            "Failed to process preference. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
      [initialValues, navigate]
    );

  return {
    loading,
    preferencesDetails,
    initialValues,
    handleFormSubmit,
  };
};

export default useItemPreferencesForm;
