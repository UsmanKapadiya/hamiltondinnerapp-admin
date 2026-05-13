import {
  Box,
  useTheme,
  InputBase,
  IconButton,
} from "@mui/material";

import {
  Close,
  Home,
  SearchOutlined,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";

import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";

import useRoom from "./useRoom";
import { getColumns } from "./room.utils";

const Room = () => {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const {
    searchText,
    setSearchText,

    dialogOpen,

    selectedRoomName,

    selectedIds,
    setSelectedIds,

    loading,

    filteredRooms,

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
  } = useRoom();

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
        title="Resident Details"
        icon={<Home />}
        buttons={true}
        addNewClick={handleAdd}
        addBulkDelete={handleBulkDelete}
        addButton={permissions.canShowAdd}
        deleteButton={permissions.canShowDelete}
      />

      {!canAccess ? (
        <NoPermissionMessage
          title="You do not have permission to view Resident Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      ) : (
        <Box
          mt="40px"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },

            "& .MuiDataGrid-cell": {
              border: "none",
            },

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
          {/* Search */}
          <Box
            display="flex"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            mb="10px"
          >
            <InputBase
              placeholder="Search by Unit Number or Resident Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <IconButton
              onClick={() => setSearchText("")}
            >
              {searchText ? (
                <Close />
              ) : (
                <SearchOutlined />
              )}
            </IconButton>
          </Box>

          {/* Grid */}
          <DataGrid
            rows={filteredRooms}
            columns={columns}
            loading={loading}
            checkboxSelection
            pagination
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={(model) =>
              setPagination((prev) => ({
                ...prev,
                page: model.page + 1,
                pageSize: model.pageSize,
              }))
            }
            onRowSelectionModelChange={(ids) =>
              setSelectedIds(ids)
            }
            pageSizeOptions={[10, 20, 50, 100]}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />

          {/* Dialog */}
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length
                ? `Delete ${selectedIds.length} Resident${
                    selectedIds.length > 1
                      ? "s"
                      : ""
                  }?`
                : `Delete "${selectedRoomName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default Room;
