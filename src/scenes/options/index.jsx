import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  FormatListBulletedOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const ItemOptions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [optionsListData, setOptionsListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Permissions
  const canAdd = hasPermission(permissionList, "add_ItemOptions");
  const canView = hasPermission(permissionList, "read_ItemOptions");
  const canEdit = hasPermission(permissionList, "edit_ItemOptions");
  const canDelete = hasPermission(permissionList, "delete_ItemOptions");
  const canBrowse = hasPermission(permissionList, "browse_Options");

  // Fetch options list
  const fetchALLOptionsList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ItemServices.getOptionList();
      setOptionsListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchALLOptionsList();
  }, [fetchALLOptionsList]);

  // Handlers
  const handleRowSelection = useCallback((ids) => setSelectedIds(ids), []);
  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedOptionName(data?.option_name);
    setDialogOpen(true);
  }, []);
  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedOptionName
      ? bulkDeleteOptions(selectedIds)
      : deleteOptions(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedOptionName, selectedId]);
  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedOptionName("");
  }, []);
  const handleView = useCallback((id) => {
    navigate(`/item-options/${id}`, { state: { id } });
  }, [navigate]);
  const handleEdit = useCallback((id) => {
    const selectedRow = optionsListData.find((row) => row.id === id);
    navigate(`/item-options/${id}/edit`, { state: selectedRow });
  }, [navigate, optionsListData]);
  const handleAddNewClick = useCallback(() => {
    navigate("/item-options/create");
  }, [navigate]);
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Option to delete.");
    }
  }, [selectedIds]);
  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
  }, []);

  // Delete functions
  const bulkDeleteOptions = useCallback(async (ids) => {
    setLoading(true);
    try {
      let data = JSON.stringify({ ids });
      await ItemServices.bulkdeleteOptions(data);
      toast.success("Multiple Options Deleted successfully!");
      fetchALLOptionsList();
    } catch (error) {
      console.error("Error deleting options:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLOptionsList]);
  const deleteOptions = useCallback(async (id) => {
    setLoading(true);
    try {
      await ItemServices.deleteOptions(id);
      toast.success("Options Deleted successfully!");
      fetchALLOptionsList();
      setSelectedOptionName("");
    } catch (error) {
      console.error("Error deleting option:", error);
      toast.error("Failed to process Option. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLOptionsList]);

  // Memoized columns
  const columns = useMemo(() => [
    { field: "option_name", headerName: "Option Name", flex: 1 },
    {
      field: "option_name_cn",
      headerName: "Option Chinese Name",
      flex: 1,
    },
    {
      field: "is_paid_item",
      headerName: "Is Paid Item",
      renderCell: (params) => (params.value ? "Yes" : "No"),
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

  // Memoized filtered rows
  const filteredRows = useMemo(() => {
    const search = debouncedSearchText.toLowerCase();
    return optionsListData.filter(
      (row) =>
        row.option_name?.toLowerCase().includes(search) ||
        row.option_name_cn?.toLowerCase().includes(search)
    );
  }, [optionsListData, debouncedSearchText]);

  return (
    <Box m="20px">
      <Header
        title="Item Options"
        icon={<FormatListBulletedOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
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
              placeholder="Search by Option Name, or Option Chinese Name..."
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
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
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
              selectedIds.length > 0 && !selectedOptionName
                ? `Are you sure you want to delete ${selectedIds.length} Option items?`
                : `Are you sure you want to delete the Option "${selectedOptionName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Options Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default ItemOptions;
