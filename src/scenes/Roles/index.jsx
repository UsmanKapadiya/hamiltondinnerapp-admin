import {
  Box,
  Typography,
  useTheme,
  Button,
  InputBase,
  IconButton,
} from "@mui/material";
import {
  Close,
  LockOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import RoleServices from "../../services/roleServices";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const Roles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const userData = JSON.parse(localStorage.getItem('userData'));

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

  const canAdd = hasPermission(permissionList, "add_Roles");
  const canView = hasPermission(permissionList, "read_Roles");
  const canEdit = hasPermission(permissionList, "edit_Roles");
  const canDelete = hasPermission(permissionList, "delete_Roles");
  const canBrowse = hasPermission(permissionList, "browse_Roles");

  useEffect(() => {
    fetchAllRolelist();
  }, []);

  const fetchAllRolelist = async () => {
    try {
      setLoading(true);
      const response = await RoleServices.getRoleList();
      setRoleList(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching role list:", error);
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteMenu = async (ids) => {
    try {
      const data = JSON.stringify({ ids });
      await RoleServices.bulkdeleteRole(data);
      toast.success("Multiple Roles deleted successfully!");
      fetchAllRolelist();
    } catch (error) {
      console.error("Error deleting roles:", error);
      toast.error("Failed to delete roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    try {
      setLoading(true);
      await RoleServices.deleteRole(id);
      toast.success("Role deleted successfully!");
      fetchAllRolelist();
      setSelectedRoleName("");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (data) => {
    setSelectedId(data?.id);
    setSelectedRoleName(data?.name);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    const isBulk = selectedIds.length > 0 && selectedId === null;
    isBulk ? bulkDeleteMenu(selectedIds) : deleteRole(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedRoleName('')
  };

  const handleView = useCallback((id) => {
    const selectedRow = roleList.find((row) => row.id === id);
    navigate(`/roles-details/${id}`, { state: selectedRow });
  }, [navigate, roleList]);

  const handleEdit = useCallback((id) => {
    const selectedRow = roleList.find((row) => row.id === id);
    navigate(`/roles-details/${id}/edit`, { state: selectedRow });
  }, [navigate, roleList]);

  const handleAddNewClick = () => navigate("/roles-details/create");

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Role to delete.");
    }
  };

  const handleRowSelection = (ids) => setSelectedIds(ids);

  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
  };

  const filteredRoles = useMemo(() => {
    return roleList.filter(
      (row) =>
        row.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [roleList, searchText]);

  const columns = useMemo(() => [
    { field: "name", headerName: "Name", flex: 1 },
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
            disabled={!canView && userData?.role !== "superadmin"}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(row.id)}
            disabled={!canEdit && userData?.role !== "superadmin"}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(row)}
            disabled={!canDelete && userData?.role !== "superadmin"}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ], [handleView, handleEdit, canView, canEdit, canDelete]);

  return (
    <Box m="20px">
      <Header
        title="Roles"
        icon={<LockOutlined />}
        Buttons={true}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        buttons={true}
        addButton={(canAdd && canBrowse) || userData?.role === "superadmin"}
        deleteButton={(canDelete && canBrowse) || userData?.role === "superadmin"}
      />
      {canBrowse || userData?.role === "superadmin" ? (
        <Box mt="40px" height="75vh" flex={1} sx={{
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
        }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} borderRadius="3px" mb="10px">
            <InputBase
              placeholder="Search by Role Name"
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }} onClick={() => setSearchText("")}>
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>
          <DataGrid
            rows={filteredRoles}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={filteredRoles.length}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[10, 20, 50, 100]}
            checkboxSelection
            onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
            components={{ LoadingOverlay: CustomLoadingOverlay }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedRoleName
                ? `Are you sure you want to delete ${selectedIds.length} Roles?`
                : `Are you sure you want to delete the Role "${selectedRoleName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Role Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )
      }
    </Box>
  );
};

export default Roles;
