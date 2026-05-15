import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import ItemServices from "../../../services/itemServices";

const useItemPreferencesView = () => {
  const location = useLocation();

  const [preferencesDetails, setPreferencesDetails] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const itemPreferenceId =
    location.state?.id;

  const getPreferencesDetails =
    useCallback(async (id) => {
      if (!id) return;

      setLoading(true);

      try {
        const response =
          await ItemServices.getPreferencesDetails(
            id
          );

        setPreferencesDetails(
          response?.data || {}
        );
      } catch (error) {
        console.error(
          "Error fetching preference details:",
          error
        );

        setPreferencesDetails({});
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    getPreferencesDetails(
      itemPreferenceId
    );
  }, [
    itemPreferenceId,
    getPreferencesDetails,
  ]);

  return {
    loading,
    preferencesDetails,
  };
};

export default useItemPreferencesView;
