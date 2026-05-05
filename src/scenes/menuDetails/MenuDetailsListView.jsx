import { Box, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { Close, CreateOutlined, SearchOutlined } from "@mui/icons-material";
import { useMemo } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import _ from "lodash";

const MenuDetailsListView = ({
  theme,
  colors,
  searchText,
  setSearchText,
  dialogOpen,
  selectedIds,
  selectedMenuName,
  loading,
  pagination,
  filteredRows,
  handleView,
  handleEdit,
  handleDelete,
  confirmDelete,
  cancelDelete,
  handleAddNewClick,
  handleBulkDelete,
  handleRowSelection,
  handlePaginationChange,
  canAdd,
  canView,
  canEdit,
  canDelete,
  canBrowse,
}) => {
  // Columns definition
  const columns = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        valueFormatter: (params) => {
          const date = new Date(params.value);
          return `${_.padStart((date.getMonth() + 1).toString(), 2, "0")}-${_.padStart(
            date.getDate().toString(),
            2,
            "0"
          )}-${date.getFullYear()}`; //MM-DD-YYYY
        },
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
    ],
    [handleView, handleEdit, handleDelete, canView, canEdit, canDelete]
  );

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
              placeholder="Search by Menu Date..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton type="button" sx={{ p: 1 }} onClick={() => setSearchText("")}>
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            pageSizeOptions={[10, 20, 50, 100]}
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
              selectedIds.length > 0 && !selectedMenuName
                ? `Are you sure you want to delete ${selectedIds.length} items?`
                : `Are you sure you want to delete the menu "${selectedMenuName}" ?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Menu Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default MenuDetailsListView;
