import { Box, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  PersonOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import UserServices from "../../services/userServices";
import { useSelector } from "react-redux";
import { hasPermission } from "../../components/permissions";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const User = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItemName, setselectedItemName] = useState("");
  const [userListData, setUserListData] = useState([])
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchALLUserList()
  }, []);

  const fetchALLUserList = async () => {
    try {
      const response = await UserServices.getUserList();
      setUserListData(response.data);
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (data) => {
    setSelectedIds([])
    setSelectedId(data?.id);
    setselectedItemName(data?.name);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedItemName
      ? bulkDeleteUsers(selectedIds) : deleteUser(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setselectedItemName()
  };

  const handleView = (id) => {
    navigate(`/users-details/${id}`, {
      state: { id, }
    });
  };

  const handleEdit = (id) => {
    const selectedRow = userListData.find((row) => row.id === id);
    navigate(`/users-details/${id}/edit`, {
      state: {
        selectedRow,
      },
    });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/users-details/create");
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one User to delete.");
    }
  };
  const handleOrderClick = () => {
  };

  const handleRowSelection = (ids) => {
    setSelectedIds(ids);
  };


  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)
  };

  const bulkDeleteUsers = async (ids) => {
    console.log("Selected IDs for deletion:", ids); // Debugging

    if (!ids || ids.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }

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
  };
  const deleteUser = async (id) => {
    try {
      const response = await UserServices.deleteUser(id);
      // console.log(response)
      setLoading(true)
      toast.success("User Deleted successfully!");
      fetchALLUserList();
      setselectedItemName();
    } catch (error) {
      console.error("Error fetching User list:", error);
      toast.error("Failed to process User. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAdd = hasPermission(permissionList, "add_Users");
  const canView = hasPermission(permissionList, "read_Users");
  const canEdit = hasPermission(permissionList, "edit_Users");
  const canDelete = hasPermission(permissionList, "delete_Users");
  const canBrowse = hasPermission(permissionList, "browse_Users");

  // console.log("user",userListData)
  const columns = [
    { field: "name", headerName: "Name", flex: 1, },
    {
      field: "user_name",
      headerName: "User Name",
      // flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    // {
    //   field: "created_at",
    //   headerName: "Created At",
    //   flex: 1,
    // },
    // {
    //   field: "email_verified_at",
    //   headerName: "Email Verified At",
    //   flex: 1,
    // },
    {
      field: "avatar",
      headerName: "Avtar",
      //flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      // flex: 1,
    },
    // {
    //   field: "roles",
    //   headerName: "Roles",
    //   // flex: 1,
    // },
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
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Users"
        icon={<PersonOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
        addButton={canAdd && canBrowse}
        deleteButton={canDelete && canBrowse}
      />
      {canBrowse ? (
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
          <DataGrid
            rows={userListData}
            columns={columns}
            loading={loading}
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
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
                : `Are you sure you want to delete the Option "${selectedItemName}"?`
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

