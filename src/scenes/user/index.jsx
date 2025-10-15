import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  PersonOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import UserServices from "../../services/userServices";
import { useSelector } from "react-redux";
import { hasPermission } from "../../components/permissions";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const defaultAvtar = "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp"

// Debounce hook for search input
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const User = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [userListData, setUserListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Memoize permission checks
  const canAdd = useMemo(() => hasPermission(permissionList, "add_Users"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_Users"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_Users"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_Users"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Users"), [permissionList]);

  const fetchALLUserList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserServices.getUserList();
      setUserListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count || response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching user list:", error);
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchALLUserList();
  }, [fetchALLUserList]);

  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedItemName(data?.name);
    setDialogOpen(true);
  }, []);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    try {
      await UserServices.deleteUser(id);
      toast.success("User Deleted successfully!");
      fetchALLUserList();
      setSelectedItemName("");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to process User. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLUserList]);

  const bulkDeleteUsers = useCallback(async (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }
    setLoading(true);
    try {
      const data = { ids };
      const response = await UserServices.bulkdeleteUser(data);
      if (response.success) {
        toast.success("Multiple Users Deleted successfully!");
        fetchALLUserList();
      } else {
        toast.error(response.errors?.ids?.[0] || "Failed to delete users.");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Failed to process the request. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLUserList]);

  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedItemName
      ? bulkDeleteUsers(selectedIds)
      : deleteUser(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedItemName, selectedId, bulkDeleteUsers, deleteUser]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedItemName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/users-details/${id}`, { state: { id } });
  }, [navigate]);

  const handleEdit = useCallback((id) => {
    const selectedRow = userListData.find((row) => row.id === id);
    navigate(`/users-details/${id}/edit`, { state: { selectedRow } });
  }, [navigate, userListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/users-details/create");
  }, [navigate]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one User to delete.");
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

  // Memoized columns
  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "user_name", headerName: "User Name" },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
              src={params.value || defaultAvtar}
            onError={e => {
              e.target.onerror = null;
              e.target.src = defaultAvtar;
            }}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    }, 
    { field: "role", headerName: "Role" },
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
  ], [canView, canEdit, canDelete, handleView, handleEdit, handleDelete]);

  // Memoized filtered rows
  const filteredRows = useMemo(() => {
    const search = debouncedSearchText.toLowerCase();
    return userListData.filter(
      (row) =>
        row.name?.toLowerCase().includes(search) ||
        row.user_name?.toLowerCase().includes(search) ||
        row.email?.toLowerCase().includes(search)
    );
  }, [userListData, debouncedSearchText]);

  return (
    <Box m="20px">
      <Header
        title="Users"
        icon={<PersonOutlined />}
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
              placeholder="Search by Name, Username, or Email..."
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
            pageSizeOptions={[10, 20, 50, 100]}
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
              selectedIds.length > 0 && !selectedItemName
                ? `Are you sure you want to delete ${selectedIds.length} Users?`
                : `Are you sure you want to delete the User "${selectedItemName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view User Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default User;
