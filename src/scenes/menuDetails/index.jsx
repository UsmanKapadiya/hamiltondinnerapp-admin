import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  CreateOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import MenuServices from "../../services/menuServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const MenuDetails = () => {
  const navigate = useNavigate();
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    pageSize: 10,
    total: 0,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch menu list on mount, pagination, or search change
  useEffect(() => {
    fetchMenuList();
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const fetchMenuList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await MenuServices.getMenuList({
        currentPage: pagination.page,
        perPageRecords: pagination.pageSize,
        search: debouncedSearch,
      });
      setMenuList(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const bulkDeleteMenu = useCallback(async (ids) => {
    try {
      let data = JSON.stringify({ ids });
      await MenuServices.bulkdeleteMenus(data);
      toast.success("Multiple Menus Deleted successfully!");
      fetchMenuList();
    } catch (error) {
      console.error("Error deleting menus:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchMenuList]);

  const deleteMenu = useCallback(async (id) => {
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
  }, [fetchMenuList]);

  const handleDelete = useCallback((data) => {
    setSelectedId(data?.id);
    setSelectedMenuName(data?.menu_name);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedMenuName
      ? bulkDeleteMenu(selectedIds)
      : deleteMenu(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedMenuName, selectedId, bulkDeleteMenu, deleteMenu]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedMenuName("");
  }, []);

  const handleView = useCallback((id) => {
    const selectedRow = menuList.find((row) => row.id === id);
    navigate(`/menu-details/${id}`, { state: selectedRow });
  }, [navigate, menuList]);

  const handleEdit = useCallback((id) => {
    const selectedRow = menuList.find((row) => row.id === id);
    navigate(`/menu-details/${id}/edit`, { state: selectedRow });
  }, [navigate, menuList]);

  const handleAddNewClick = useCallback(() => {
    navigate("/menu-details/create");
  }, [navigate]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Menu to delete.");
    }
  }, [selectedIds]);

  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
  }, []);

  const canAdd = useMemo(() => hasPermission(permissionList, "add_Menus"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_Menus"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_Menus"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_Menus"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Menus"), [permissionList]);

  const columns = useMemo(() => [
    { field: "menu_name", headerName: "Menu Name", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => handleView(row.id)}
            disabled={!canView}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(row.id)}
            disabled={!canEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(row)}
            disabled={!canDelete}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ], [handleView, handleEdit, handleDelete, canView, canEdit, canDelete]);

  // Filtered rows for client-side search (if needed)
  const filteredRows = useMemo(() => {
    if (!debouncedSearch) return menuList;
    return menuList.filter(
      (row) =>
        row.menu_name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [menuList, debouncedSearch]);

  return (
    <Box m="20px">
      <Header
        title="Menu Details"
        icon={<CreateOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={() => {}}
        showToggleClick={() => {}}
        buttons={true}
        addButton={canAdd && canBrowse}
        deleteButton={canDelete && canBrowse}
      />
      {canBrowse ? (
        <Box
          mt="40px"
          height="75vh"
          flex={1}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-iconSeparator": {
              color: colors.primary[100],
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            mb="10px"
          >
            <InputBase
              placeholder="Search Menu..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: 1 }}
              onClick={() => setSearchText("")}
            >
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            onPaginationModelChange={handlePaginationChange}
            checkboxSelection
            onRowSelectionModelChange={handleRowSelection}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedMenuName
                ? `Are you sure you want to delete ${selectedIds.length} items?`
                : `Are you sure you want to delete the menu "${selectedMenuName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Menu Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default MenuDetails;
