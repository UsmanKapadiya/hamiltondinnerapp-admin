import {
  Box,
  useTheme,
  InputBase,
  IconButton,
} from "@mui/material";

import {
  Close,
  DynamicFormOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";

import useForms from "./useForms";
import { getColumns } from "./forms.utils";

const Forms = () => {
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
    filteredForms,
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
  } = useForms();

  const columns = getColumns({
    handleView,
    handleEdit,
    handleDelete: handleDeleteClick,
    permissions,
  });

  return (
    <Box m="20px">
      <Header
        title="Form Types"
        icon={<DynamicFormOutlined />}
        buttons={true}
        addNewClick={handleAdd}
        addBulkDelete={handleBulkDelete}
        addButton={permissions.canAdd && permissions.canBrowse}
        deleteButton={permissions.canDelete && permissions.canBrowse}
      />

      {!permissions.canBrowse ? (
        <NoPermissionMessage
          title="You do not have permission to view Form Details."
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
          {/* Search */}
          <Box
            display="flex"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
            mb="10px"
          >
            <InputBase
              placeholder="Search by Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <IconButton onClick={() => setSearchText("")}>
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>

          {/* Grid */}
          <DataGrid
            rows={filteredForms}
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
              setPagination((prev) => ({
                ...prev,
                page: model.page + 1,
                pageSize: model.pageSize,
              }))
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
                ? `Are you sure you want to delete ${selectedIds.length} Forms?`
                : `Are you sure you want to delete the Form "${selectedItemName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      )}
    </Box>
  );
};

export default Forms;
