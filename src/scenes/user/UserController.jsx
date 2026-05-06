import {
  Box,
  useTheme,
  InputBase,
  IconButton,
} from "@mui/material";
import { Close, SearchOutlined, PersonOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";

import useUser from "./useUser";
import { getColumns } from "./users.utils";

const User = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    searchText,
    setSearchText,
    dialogOpen,
    selectedUserName,
    selectedIds,
    setSelectedIds,
    loading,
    filteredUsers,
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
  } = useUser();

  // ✅ unified access rule
  console.log(permissions);
  const canAccess = permissions.canBrowse;

  const columns = getColumns({
    handleView,
    handleEdit,
    handleDelete: handleDeleteClick,
    permissions,
  });

  return (
    <Box m="20px">
      <Header
        title="Users"
        icon={<PersonOutlined />}
        buttons={true}
        addNewClick={handleAdd}
        addBulkDelete={handleBulkDelete}
        addButton={permissions.canAdd && permissions.canBrowse}   
        deleteButton={permissions.canDelete && permissions.canBrowse} 
      />
      {!canAccess ? (
        <NoPermissionMessage
          title="You do not have permission to view User Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      ) : (
        <Box
          mt="40px"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          {/* 🔍 Search */}
          <Box
            display="flex"
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
            <IconButton onClick={() => setSearchText("")}>
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>

          {/* 📊 Grid */}
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
            pagination
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={(model) =>
              setPagination((p) => ({
                ...p,
                page: model.page + 1,
                pageSize: model.pageSize,
              }))
            }
            components={{ LoadingOverlay: CustomLoadingOverlay }}
          />

          {/* ⚠️ Dialog */}
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length
                ? `Are you sure you want to delete ${selectedIds.length} Users?`
                : `Are you sure you want to delete the User "${selectedUserName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default User;