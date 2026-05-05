import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserServices from "../../../services/userServices";

const useUserView = () => {
  const location = useLocation();
  const userId = location?.state?.id;

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserDetails = async (id) => {
      try {
        setLoading(true);
        const response = await UserServices.getUserDetails(id);
        setUserDetails(response?.data || {});
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails({});
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails(userId);
  }, [userId]);

  return {
    loading,
    userDetails,
  };
};

export default useUserView;