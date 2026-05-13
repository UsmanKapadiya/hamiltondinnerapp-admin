import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import CategoryServices from "../../services/categoryServices";
import { hasPermission } from "../../components/permissions";

const useCategoryList = () => {
  const navigate = useNavigate();
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categoryListData, setCategoryListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permissions (memoized)
  const canAdd = useMemo(() => hasPermission(permissionList, "add_CategoryDetails"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_CategoryDetails"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_CategoryDetails"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_CategoryDetails"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Category"), [permissionList]);

  // Fetch category list
  const getCategoryListData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoryServices.getCategoryList();
      setCategoryListData(response?.data || []);
    } catch (error) {
      console.error("Error fetching Course list:", error);
      toast.error("Failed to fetch Course list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategoryListData();
  }, [getCategoryListData]);

  // Handlers (memoized)
  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedCategoryName(data?.cat_name);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedCategoryName
      ? bulkDeleteCategory(selectedIds)
      : deleteCategory(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedCategoryName, selectedId]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedCategoryName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/category-details/${id}`, { state: { id, categoryListData } });
  }, [navigate, categoryListData]);

  const handleEdit = useCallback((id) => {
    const selectedRow = _.find(categoryListData, { id });
    navigate(`/category-details/${id}/edit`, { state: { selectedCategory: selectedRow, categoryListData } });
  }, [navigate, categoryListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/category-details/create", { state: { categoryListData } });
  }, [navigate, categoryListData]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Course to delete.");
    }
  }, [selectedIds]);

  const handleOrderClick = useCallback(() => {
    navigate("/category-details/order");
  }, [navigate]);

  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  // Delete functions
  const bulkDeleteCategory = useCallback(async (ids) => {
    try {
      setLoading(true);
      await CategoryServices.bulkdeleteCategorys(JSON.stringify({ ids }));
      toast.success("Multiple categories deleted successfully!");
      getCategoryListData();
    } catch (error) {
      console.error("Error deleting categories:", error);
      toast.error("Failed to delete categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCategoryListData]);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      await CategoryServices.deleteCategorys(id);
      toast.success("Course deleted successfully!");
      getCategoryListData();
      setSelectedCategoryName("");
    } catch (error) {
      console.error("Error deleting Course:", error);
      toast.error("Failed to delete Course. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCategoryListData]);

  // Filtered rows (memoized)
  const filteredRows = useMemo(() => {
    if (_.isEmpty(searchText)) return categoryListData;
    
    const search = _.toLower(searchText);
    return _.filter(categoryListData, (row) =>
      _.toLower(row.cat_name)?.includes(search) ||
      _.toLower(row.category_chinese_name)?.includes(search)
    );
  }, [categoryListData, searchText]);

  return {
    searchText,
    setSearchText,
    dialogOpen,
    selectedIds,
    selectedCategoryName,
    categoryListData,
    loading,
    canAdd,
    canView,
    canEdit,
    canDelete,
    canBrowse,
    filteredRows,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleView,
    handleEdit,
    handleAddNewClick,
    handleBulkDelete,
    handleOrderClick,
    handleRowSelection,
  };
};

export default useCategoryList;
