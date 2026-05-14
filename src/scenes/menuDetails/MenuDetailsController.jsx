import {
  Box,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Close,
  CreateOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import  Header  from "../../components/Header";
import { tokens } from "../../theme";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import useMenuDetails from "./useMenuDetails";
import { getColumns } from "./menuDetails.utils";

const MenuDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    searchText,
    setSearchText,
    dialogOpen,
    selectedMenuName,
    selectedIds,
    setSelectedIds,
    loading,
    filteredRows,
    pagination,
    setPagination,
    permissions,
    handleView,
    handleEdit,
    handleDeleteClick,
    handleAddNewClick,
    handleBulkDelete,
    confirmDelete,
    cancelDelete,
  } = useMenuDetails();

  const columns = getColumns({
    handleView,
    handleEdit,
    handleDelete: handleDeleteClick,
    permissions,
  });

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
        addButton={
          permissions.canAdd &&
          permissions.canBrowse
        }
        deleteButton={
          permissions.canDelete &&
          permissions.canBrowse
        }
      />

      {!permissions.canBrowse ? (
        <NoPermissionMessage
          title="You do not have permission to view Menu Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      ) : (
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

            "& .MuiDataGrid-columnHeaders":
            {
              backgroundColor:
                colors.blueAccent[700],
            },

            "& .MuiDataGrid-virtualScroller":
            {
              backgroundColor:
                colors.primary[400],
            },

            "& .MuiDataGrid-footerContainer":
            {
              backgroundColor:
                colors.blueAccent[700],
            },
          }}
        >
          {/* Search */}
          <Box
            display="flex"
            alignItems="center"
            bgcolor={
              colors.primary[400]
            }
            borderRadius="3px"
            mb="10px"
          >
            <InputBase
              placeholder="Search by Menu Date..."
              sx={{
                ml: 2,
                flex: 1,
              }}
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />

            <IconButton
              onClick={() =>
                setSearchText("")
              }
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
            rows={filteredRows}
            columns={columns}
            loading={loading}
            checkboxSelection
            pagination
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={{
              page:
                pagination.page - 1,
              pageSize:
                pagination.pageSize,
            }}
            pageSizeOptions={[
              10,
              20,
              50,
              100,
            ]}
            onPaginationModelChange={(
              model
            ) =>
              setPagination(
                (prev) => ({
                  ...prev,
                  page:
                    model.page + 1,
                  pageSize:
                    model.pageSize,
                })
              )
            }
            onRowSelectionModelChange={(
              ids
            ) =>
              setSelectedIds(ids)
            }
            components={{
              LoadingOverlay:
                CustomLoadingOverlay,
            }}
          />

          {/* Dialog */}
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length
                ? `Are you sure you want to delete ${selectedIds.length} items?`
                : `Are you sure you want to delete the menu "${selectedMenuName}" ?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default MenuDetails;
