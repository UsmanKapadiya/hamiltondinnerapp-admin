import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";

import UserServices from "../../../services/userServices";
import RoleServices from "../../../services/roleServices";

const useUserDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = _.get(location, "state.selectedRow", null);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setUserData(user);
    setLoading(false);
  }, [user]);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await RoleServices.getRoleList();
      setRoles(_.get(res, "data", []));
    } catch (err) {
      toast.error("Failed to load roles");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSubmit = useCallback(
    async (values) => {
      setLoading(true);

      try {
        const formData = new FormData();

        _.forOwn(values, (val, key) => {
          if (key !== "avatar_preview") {
            if (!_.isNil(val)) formData.append(key, val);
          }
        });

        if (values.avatar instanceof File) {
          formData.append("avatar", values.avatar);
        }

        if (values.avatar_removed) {
          formData.append("avatar", "");
        }

        if (values.id) {
          formData.append("id", values.id);
        }

        const response = values.id
          ? await UserServices.updatetUser(values.id, formData)
          : await UserServices.createUser(formData);

        if (_.get(response, "success")) {
          toast.success("User saved successfully");
          navigate("/users-details");
        } else {
          toast.error("Failed to save user");
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return {
    loading,
    userData,
    roles,
    handleSubmit,
  };
};

export default useUserDetailsForm;