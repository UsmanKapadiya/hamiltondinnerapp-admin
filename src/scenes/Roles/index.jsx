import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  LockOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import RoleServices from "../../services/roleServices";

const Roles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const perPageRecords = (10)
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
  useEffect(() => {
    fetchAllRolelist();
    // setLoading(true)
  }, []);

  const fetchAllRolelist = async () => {
    try {
      setLoading(true)
      const response = await RoleServices.getRoleList();
      // console.log(response)
      setRoleList(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };
  const bulkDeleteMenu = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await RoleServices.bulkdeleteRole(data);
      // console.log(response)
      setLoading(true)
      toast.success("Multiple Roles Deleted successfully!");
      fetchAllRolelist();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteRole = async (id) => {
    try {
      setLoading(true)
      const response = await RoleServices.deleteRole(id);
      console.log(response)
      toast.success("Role Deleted successfully!");
      fetchAllRolelist();
      setSelectedRoleName("");
    } catch (error) {
      console.error("Error fetching Role list:", error);
      toast.error("Failed to process Role. Please try again.");
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
    selectedIds.length > 0 && !selectedRoleName
      ? bulkDeleteMenu(selectedIds) : deleteRole(selectedId);
    setDialogOpen(false);
    setLoading(true)
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };



  const handleView = (id) => {
    const selectedRow = roleList.find((row) => row.id === id);
    navigate(`/roles-details/${id}`, { state: selectedRow });
  };

  const handleEdit = (id) => {
    const selectedRow = roleList.find((row) => row.id === id);
    navigate(`/roles-details/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/roles-details/create");
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Role to delete.");
    }
  };
  const handleRowSelection = (ids) => {
    setSelectedIds(ids);
  };

  const handleOrderClick = () => {
    // navigate("/item-details/order");
  };
  const columns = [
    { field: "name", headerName: "Name", flex: 1, },
    { field: "display_name", headerName: "Display", flex: 1, }, // Fixed the typo
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleView(row.id)}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(row.id)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDelete(row)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)

  };

  return (
    <Box m="20px">
      <Header
        title="Roles"
        icon={<LockOutlined />}
        Buttons={true}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
      />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
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
            placeholder="Search by Role Name, or Display Name..."
            sx={{ ml: 2, flex: 1 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: 1 }}
            onClick={() => setSearchText("")}
          >
            {searchText
              ? <Close />
              : <SearchOutlined />
            }
          </IconButton>
        </Box>
        <DataGrid
          rows={roleList.filter(
              (row) =>
                row.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                row.display_name?.toLowerCase().includes(searchText.toLowerCase())
            )}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={handlePaginationChange}
          checkboxSelection
          onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
          components={{
            LoadingOverlay: CustomLoadingOverlay,
          }}
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
    </Box>
  );
};

export default Roles;

