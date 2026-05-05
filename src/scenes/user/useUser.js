import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import UserServices from "../../services/userServices";
import { hasPermission } from "../../components/permissions";

const useUser = () => {
  const navigate = useNavigate();

  const permissionList = useSelector(
    (state) => state?.permissionState?.permissionsList
  );

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // ✅ permissions same as roles
  const permissions = useMemo(() => {
    const base = {
      canAdd: hasPermission(permissionList, "add_Users"),
      canView: hasPermission(permissionList, "read_Users"),
      canEdit: hasPermission(permissionList, "edit_Users"),
      canDelete: hasPermission(permissionList, "delete_Users"),
      canBrowse: hasPermission(permissionList, "browse_Users"),
      isSuperAdmin: userData?.role === "superadmin",
    };

    return {
      ...base,
      canShowAdd:
        (base.canAdd && base.canBrowse) || base.isSuperAdmin,
      canShowDelete:
        (base.canDelete && base.canBrowse) || base.isSuperAdmin,
    };
  }, [permissionList, userData]);

  // ✅ fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await UserServices.getUserList();
      setUserList(res?.data || []);
      setPagination((p) => ({
        ...p,
        total: res?.count || res?.data?.length,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ actions
  const handleView = useCallback(
    (id) => {
      const row = userList.find((u) => u.id === id);
      navigate(`/users-details/${id}`, { state: { id } });
    },
    [userList, navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      const row = userList.find((u) => u.id === id);
      navigate(`/users-details/${id}/edit`, {
        state: { selectedRow: row },
      });
    },
    [userList, navigate]
  );

  const handleAdd = () => navigate("/users-details/create");

  const handleDeleteClick = (row) => {
    setSelectedId(row.id);
    setSelectedUserName(row.name);
    setDialogOpen(true);
  };

  const deleteSingle = async (id) => {
    await UserServices.deleteUser(id);
    toast.success("User deleted");
    fetchUsers();
  };

  const deleteBulk = async (ids) => {
    await UserServices.bulkdeleteUser({ ids });
    toast.success("Users deleted");
    fetchUsers();
  };

  const confirmDelete = () => {
    const isBulk = selectedIds.length > 0 && !selectedId;
    isBulk ? deleteBulk(selectedIds) : deleteSingle(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedUserName("");
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      toast.warning("Select at least one user");
      return;
    }
    setDialogOpen(true);
  };

  // ✅ filter (same as roles)
  const filteredUsers = useMemo(() => {
    return userList.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.user_name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [userList, searchText]);

  return {
    searchText,
    setSearchText,
    dialogOpen,
    selectedUserName,
    selectedIds,
    setSelectedIds,
    loading,
    filteredUsers,
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

export default useUser;