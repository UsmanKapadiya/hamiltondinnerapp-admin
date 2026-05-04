import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useRoleView = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [roleDetails, setRoleDetails] = useState(null);

  useEffect(() => {
    if (location.state) {
      setRoleDetails(location.state);
    }
    setLoading(false);
  }, [location.state]);

  return {
    loading,
    roleDetails,
  };
};

export default useRoleView;
