import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import MenuServices from "../../services/menuServices";
import ItemServices from "../../services/itemServices";
import { setItemList } from "../../redux/action/itemAction";
import { hasPermission } from "../../components/permissions";

const useMenuDetailsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionList = useSelector((state) => _.get(state, "permissionState.permissionsList"));

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMenuName, setSelectedMenuName] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 100,
    total: 0,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch menu list callback
  const fetchMenuList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await MenuServices.getMenuList({
        currentPage: pagination.page,
        perPageRecords: pagination.pageSize,
        search: debouncedSearch,
      });
      setMenuList(_.get(response, "data", []));
      setPagination((prev) => ({
        ...prev,
        total: _.get(response, "pagination.total", 0),
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to fetch menu list");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  // Fetch items list callback
  const fetchItemsList = useCallback(async () => {
    try {
      const response = await ItemServices.getItemList();
      dispatch(setItemList(_.get(response, "data", [])));
    } catch (error) {
      console.error("Error fetching items list:", error);
    }
  }, [dispatch]);

  // Fetch menu list on mount, pagination, or search change
  useEffect(() => {
    fetchMenuList();
    fetchItemsList();
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  // Bulk delete menu callback
  const bulkDeleteMenu = useCallback(
    async (ids) => {
      try {
        const data = JSON.stringify({ ids });
        await MenuServices.bulkdeleteMenus(data);
        toast.success("Multiple Menus Deleted successfully!");
        fetchMenuList();
      } catch (error) {
        console.error("Error deleting menus:", error);
        toast.error("Failed to process menu. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fetchMenuList]
  );

  // Delete single menu callback
  const deleteMenu = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await MenuServices.deleteMenus(id);
        toast.success("Menu Deleted successfully!");
        fetchMenuList();
        setSelectedMenuName("");
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast.error("Failed to process menu. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fetchMenuList]
  );

  // Handle delete with date formatting
  const handleDelete = useCallback((data) => {
    setSelectedId(_.get(data, "id"));
    const dateObj = new Date(_.get(data, "date"));
    const formattedDate = `${_.padStart(dateObj.getDate().toString(), 2, "0")}-${_.padStart(
      (dateObj.getMonth() + 1).toString(),
      2,
      "0"
    )}-${dateObj.getFullYear()}`;
    setSelectedMenuName(formattedDate);
    setDialogOpen(true);
  }, []);

  // Confirm delete callback
  const confirmDelete = useCallback(() => {
    if (selectedIds.length > 0 && !selectedMenuName) {
      bulkDeleteMenu(selectedIds);
    } else {
      deleteMenu(selectedId);
    }
    setDialogOpen(false);
  }, [selectedIds, selectedMenuName, selectedId, bulkDeleteMenu, deleteMenu]);

  // Cancel delete callback
  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedMenuName("");
  }, []);

  // Handle view callback
  const handleView = useCallback(
    (id) => {
      const selectedRow = _.find(menuList, (row) => row.id === id);
      navigate(`/menu-details/${id}`, { state: selectedRow });
    },
    [navigate, menuList]
  );

  // Handle edit callback
  const handleEdit = useCallback(
    (id) => {
      const selectedRow = _.find(menuList, (row) => row.id === id);
      navigate(`/menu-details/${id}/edit`, { state: selectedRow });
    },
    [navigate, menuList]
  );

  // Handle add new click
  const handleAddNewClick = useCallback(() => {
    navigate("/menu-details/create");
  }, [navigate]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Menu to delete.");
    }
  }, [selectedIds]);

  // Handle row selection
  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
  }, []);

  // Permission checks
  const canAdd = useMemo(() => hasPermission(permissionList, "add_Menus"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_Menus"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_Menus"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_Menus"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Menus"), [permissionList]);

  // Filtered rows for client-side search
  const filteredRows = useMemo(() => {
    if (!debouncedSearch) return menuList;
    const search = _.toLower(debouncedSearch);
    return _.filter(menuList, (row) => {
      const menuNameMatch = _.includes(_.toLower(_.get(row, "menu_name", "")), search);
      const dateMatch = _.get(row, "date")
        ? (() => {
            const dateObj = new Date(row.date);
            const formattedDate = `${_.padStart(dateObj.getDate().toString(), 2, "0")}-${_.padStart(
              (dateObj.getMonth() + 1).toString(),
              2,
              "0"
            )}-${dateObj.getFullYear()}`;
            return _.includes(formattedDate, search);
          })()
        : false;
      return menuNameMatch || dateMatch;
    });
  }, [menuList, debouncedSearch]);

  return {
    searchText,
    setSearchText,
    dialogOpen,
    selectedIds,
    selectedMenuName,
    loading,
    pagination,
    filteredRows,
    handleView,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleAddNewClick,
    handleBulkDelete,
    handleRowSelection,
    handlePaginationChange,
    canAdd,
    canView,
    canEdit,
    canDelete,
    canBrowse,
  };
};

export default useMenuDetailsList;
