import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import RoleServices from "../../../services/roleServices";
import { setPermissionList } from "../../../redux/action/permissionAction";

import {
  groupPermissionsByModule,
  MODULE_ORDER,
} from "./roleForm.utils";

const useRoleDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [loading, setLoading] = useState(true);
  const [permissionsList, setPermissionsList] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [initialValues, setInitialValues] = useState({
    id: "",
    name: "",
    permissions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await RoleServices.getPermissionsList();
        const permissions = res?.data || [];

        const role = location.state || {};
        const selected = role.permission_list?.map((p) => p.id) || [];

        const updated = permissions.map((p) => ({
          ...p,
          checked: selected.includes(p.id),
        }));

        setPermissionsList(updated);
        setInitialValues({
          id: role.id || "",
          name: role.name || "",
          permissions: selected,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const groupedPermissions = useMemo(() => {
    const grouped = groupPermissionsByModule(permissionsList);

    return [
      ...MODULE_ORDER.filter((k) => grouped[k]),
      ...Object.keys(grouped).filter((k) => !MODULE_ORDER.includes(k)),
    ].map((module) => ({
      module,
      items: grouped[module],
    }));
  }, [permissionsList]);

  const togglePermission = (id) => {
    setPermissionsList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, checked: !p.checked } : p
      )
    );
  };

  const selectAll = () => {
    setPermissionsList((prev) => prev.map((p) => ({ ...p, checked: true })));
  };

  const deselectAll = () => {
    setPermissionsList((prev) => prev.map((p) => ({ ...p, checked: false })));
  };

  const handleAccordion = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  const refreshPermissions = async () => {
    const res = await RoleServices.getRoleById(userData?.role_id);
    dispatch(setPermissionList(res?.data?.permission_list));
  };

  const handleSubmit = async (values, actions) => {
    const selected = permissionsList
      .filter((p) => p.checked)
      .map((p) => p.id);

    const payload = { ...values, permissions: selected };

    try {
      if (payload.id) {
        await RoleServices.updateRole(payload.id, payload);
        toast.success("Role updated successfully!");
      } else {
        await RoleServices.createRole(payload);
        toast.success("Role created successfully!");
        actions.resetForm();
      }

      await refreshPermissions();
      navigate("/roles-details");
    } catch (e) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return {
    loading,
    initialValues,
    groupedPermissions,
    expanded,

    togglePermission,
    selectAll,
    deselectAll,
    handleAccordion,
    handleSubmit,
  };
};

export default useRoleDetailsForm;
