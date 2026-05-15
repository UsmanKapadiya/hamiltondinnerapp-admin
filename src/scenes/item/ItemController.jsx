import {
  Box,
  useTheme,
  InputBase,
  IconButton,
} from "@mui/material";

import {
  Close,
  DvrOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import useItem from "./useItem";
import { getColumns } from "./item.utils";

const Item = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    searchText,
    setSearchText,

    dialogOpen,

    selectedItemName,

    selectedIds,
    setSelectedIds,

    loading,

    filteredRows,

    pagination,
    setPagination,

    permissions,

    categoryListData,

    handleView,
    handleEdit,
    handleAdd,

    handleDeleteClick,

    handleBulkDelete,

    handleOrderClick,

    confirmDelete,
    cancelDelete,
  } = useItem();

  const columns = getColumns({
    handleView,
    handleEdit,
    handleDelete: handleDeleteClick,
    permissions,
    categoryListData,
  });

  return (
    <Box m="20px">
      <Header
        title="Menu Item Details"
        icon={<DvrOutlined />}
        buttons={true}
        addNewClick={handleAdd}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        addButton={permissions.canShowAdd}
        deleteButton={permissions.canShowDelete}
      />

      {!permissions.canBrowse ? (
        <NoPermissionMessage
          title="You do not have permission to view Menu Item Details."
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

            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          {/* Search */}

          <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            mb="10px"
          >
            <InputBase
              placeholder="Search by Menu Item Name or Chinese Name..."
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

          {/* DataGrid */}

          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            checkboxSelection
            pagination
            rowCount={filteredRows.length}
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
              LoadingOverlay:
                CustomLoadingOverlay,
            }}
          />

          {/* Dialog */}

          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedItemName
                ? `Are you sure you want to delete ${selectedIds.length} Menu Items?`
                : `Are you sure you want to delete the Menu Item "${selectedItemName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default Item;
