import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import RoomServices from "../../../services/roomServices";

const useRoomDetailsView = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [roomDetails, setRoomDetails] = useState(null);

  const getRoomsDetails = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await RoomServices.getRoomDetails(id);

      setRoomDetails(response?.data || {});
    } catch (error) {
      setRoomDetails({});

      console.error(
        "Error fetching resident details:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRoomsDetails(location.state?.id);
  }, [location.state, getRoomsDetails]);

  const getLanguageLabel = (lang) => {
    if (lang === "1" || lang === 1) {
      return "Chinese";
    }

    if (lang === "0" || lang === 0) {
      return "English";
    }

    return lang || "-";
  };

  return {
    loading,
    roomDetails,
    getLanguageLabel,
  };
};

export default useRoomDetailsView;
