import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import RoleServices from "../../services/roleServices";
import { hasPermission } from "../../components/permissions";

const useRoles = () => {
  const navigate = useNavigate();
  const permissionList = useSelector(
    (state) => state?.permissionState?.permissionsList
  );

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const permissions = useMemo(() => {
  const base = {
    canAdd: hasPermission(permissionList, "add_Roles"),
    canView: hasPermission(permissionList, "read_Roles"),
    canEdit: hasPermission(permissionList, "edit_Roles"),
    canDelete: hasPermission(permissionList, "delete_Roles"),
    canBrowse: hasPermission(permissionList, "browse_Roles"),
    isSuperAdmin: userData?.role === "superadmin",
  };

  return {
    ...base,

    // FINAL FLAGS (use these in UI)
    canShowAdd:
      (base.canAdd && base.canBrowse) || base.isSuperAdmin,

    canShowDelete:
      (base.canDelete && base.canBrowse) || base.isSuperAdmin,
  };
}, [permissionList, userData]);



  // fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RoleServices.getRoleList();
      setRoleList(res.data);
      setPagination((prev) => ({ ...prev, total: res.count }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // actions
  const handleView = useCallback((id) => {
    const row = roleList.find((r) => r.id === id);
    navigate(`/roles-details/${id}`, { state: row });
  }, [roleList, navigate]);

  const handleEdit = useCallback((id) => {
    const row = roleList.find((r) => r.id === id);
    navigate(`/roles-details/${id}/edit`, { state: row });
  }, [roleList, navigate]);

  const handleAdd = () => navigate("/roles-details/create");

  const handleDeleteClick = (row) => {
    setSelectedId(row.id);
    setSelectedRoleName(row.name);
    setDialogOpen(true);
  };

  const deleteSingle = async (id) => {
    await RoleServices.deleteRole(id);
    toast.success("Role deleted");
    fetchRoles();
  };

  const deleteBulk = async (ids) => {
    await RoleServices.bulkdeleteRole(JSON.stringify({ ids }));
    toast.success("Roles deleted");
    fetchRoles();
  };

  const confirmDelete = () => {
    const isBulk = selectedIds.length > 0 && !selectedId;
    isBulk ? deleteBulk(selectedIds) : deleteSingle(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedRoleName("");
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      toast.warning("Select at least one role");
      return;
    }
    setDialogOpen(true);
  };

  const filteredRoles = useMemo(() => {
    return roleList.filter((r) =>
      r.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [roleList, searchText]);

  return {
    searchText,
    setSearchText,
    dialogOpen,
    selectedRoleName,
    selectedIds,
    setSelectedIds,
    loading,
    filteredRoles,
    pagination,
    setPagination,
    permissions,

    handleView,
    handleEdit,
    handleAdd,
    handleDeleteClick,
    handleBulkDelete,
    confirmDelete,
    cancelDelete,
  };
};

export default useRoles;
