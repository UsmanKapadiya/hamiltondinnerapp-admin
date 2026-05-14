import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import FormServices from "../../services/formServices";
import { hasPermission } from "../../components/permissions";

const useForms = () => {
  const navigate = useNavigate();

  const permissionList = useSelector(
    (state) => state?.permissionState?.permissionsList
  );

  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");

  const [formsList, setFormsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Permissions
  const permissions = useMemo(() => {
    return {
      canAdd: hasPermission(permissionList, "add_Form"),
      canView: hasPermission(permissionList, "read_Forms"),
      canEdit: hasPermission(permissionList, "edit_Forms"),
      canDelete: hasPermission(permissionList, "delete_Forms"),
      canBrowse: hasPermission(permissionList, "browse_Form"),
    };
  }, [permissionList]);

  // Fetch Forms
  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);

      const response = await FormServices.getFormList();

      setFormsList(response.data);

      setPagination((prev) => ({
        ...prev,
        total: response.count || response.data.length,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // View
  const handleView = useCallback(
    (id) => {
      navigate(`/forms/${id}`, { state: { id } });
    },
    [navigate]
  );

  // Edit
  const handleEdit = useCallback(
    (id) => {
      const selectedRow = formsList.find((row) => row.id === id);

      navigate(`/forms/${id}/edit`, {
        state: { selectedRow },
      });
    },
    [formsList, navigate]
  );

  // Add
  const handleAdd = () => {
    navigate("/forms/create");
  };

  // Delete Click
  const handleDeleteClick = (row) => {
    setSelectedId(row.id);
    setSelectedItemName(row.name);
    setDialogOpen(true);
  };

  // Single Delete
  const deleteSingle = async (id) => {
    try {
      setLoading(true);

      await FormServices.deleteForms(id);

      toast.success("Form deleted successfully");

      fetchForms();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form");
    } finally {
      setLoading(false);
    }
  };

  // Bulk Delete
  const deleteBulk = async (ids) => {
    try {
      setLoading(true);

      const response = await FormServices.bulkdeleteForms({ ids });

      if (response.success) {
        toast.success("Forms deleted successfully");
        fetchForms();
      } else {
        toast.error("Failed to delete forms");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete forms");
    } finally {
      setLoading(false);
    }
  };

  // Confirm Delete
  const confirmDelete = () => {
    const isBulk = selectedIds.length > 0 && !selectedId;

    isBulk
      ? deleteBulk(selectedIds)
      : deleteSingle(selectedId);

    setDialogOpen(false);
  };

  // Cancel Delete
  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedItemName("");
  };

  // Bulk Delete Button
  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      toast.warning("Please select at least one Form");
      return;
    }

    setSelectedId(null);
    setDialogOpen(true);
  };

  // Filtered Forms
  const filteredForms = useMemo(() => {
    return formsList.filter((row) =>
      row.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [formsList, searchText]);

  return {
    searchText,
    setSearchText,

    dialogOpen,

    selectedItemName,
    selectedIds,
    setSelectedIds,

    loading,

    filteredForms,

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

export default useForms;
