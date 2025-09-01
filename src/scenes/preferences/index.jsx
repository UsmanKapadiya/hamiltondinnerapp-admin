import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  ClearAllOutlined,
  Close,
  DvrOutlined,
  FormatListBulletedOutlined,
  Home,
  SearchOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const ItemPreferences = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPreferenceName, setSelectedPreferenceName] = useState("");
  const [preferencesListData, setPreferencesListData] = useState([]);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
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

  // Fetch data on mount, pagination, or search change
  useEffect(() => {
    fetchALLPreferenceList();
    // eslint-disable-next-line
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const fetchALLPreferenceList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ItemServices.getPreferencesList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
      });
      setPreferencesListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedPreferenceName(data?.pname);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedPreferenceName
      ? bulkDeletePreference(selectedIds)
      : deletePreference(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedPreferenceName, selectedId]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedPreferenceName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/menu-item-preferences/${id}`, { state: { id } });
  }, [navigate]);

  const handleEdit = useCallback((id) => {
    const selectedRow = preferencesListData.find((row) => row.id === id);
    navigate(`/menu-item-preferences/${id}/edit`, { state: selectedRow });
  }, [navigate, preferencesListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/menu-item-preferences/create");
  }, [navigate]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Preferences to delete.");
    }
  }, [selectedIds]);

  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1);
  }, []);

  const bulkDeletePreference = useCallback(async (ids) => {
    try {
      let data = JSON.stringify({ ids });
      await ItemServices.bulkdeletePreferences(data);
      setLoading(true);
      toast.success("Multiple Preferences Deleted successfully!");
      fetchALLPreferenceList();
    } catch (error) {
      console.error("Error deleting preferences:", error);
      toast.error("Failed to process preference. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLPreferenceList]);

  const deletePreference = useCallback(async (id) => {
    try {
      setLoading(true);
      await ItemServices.deletePreferences(id);
      toast.success("Preference Deleted successfully!");
      fetchALLPreferenceList();
      setSelectedPreferenceName("");
    } catch (error) {
      console.error("Error deleting preference:", error);
      toast.error("Failed to process Preference. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLPreferenceList]);

  const canAdd = useMemo(() => hasPermission(permissionList, "add_ItemPreference"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_ItemPreference"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_ItemPreference"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_ItemPreference"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Preference"), [permissionList]);

  // Memoize filtered rows
  const filteredRows = useMemo(() => {
    if (!debouncedSearch) return preferencesListData;
    return preferencesListData.filter(
      (row) =>
        row.pname?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.pname_cn?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [preferencesListData, debouncedSearch]);

  const columns = useMemo(() => [
    { field: "pname", headerName: "Preferences Name", flex: 1 },
    {
      field: "pname_cn",
      headerName: "Preferences Chinese Name",
      flex: 1,
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

  return (
    <Box m="20px">
      <Header
        title="Menu Item Preferences"
        icon={<ClearAllOutlined />}
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
              placeholder="Search by Preferences Name, or Preferences Chinese Name..."
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
            rowCount={filteredRows.length}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            onRowSelectionModelChange={handleRowSelection}
            checkboxSelection
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedPreferenceName
                ? `Are you sure you want to delete ${selectedIds.length} Preferences?`
                : `Are you sure you want to delete the Preference "${selectedPreferenceName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Preferences Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default ItemPreferences;
