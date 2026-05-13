import React, { useMemo } from "react";
import { Box, Typography, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { type } from "../../data/mockData";
import { Close, DvrOutlined, SearchOutlined } from "@mui/icons-material";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import _ from "lodash";

const CategoryListView = ({
  colors,
  searchText,
  setSearchText,
  dialogOpen,
  selectedIds,
  selectedCategoryName,
  categoryListData,
  loading,
  canAdd,
  canView,
  canEdit,
  canDelete,
  canBrowse,
  filteredRows,
  handleDelete,
  confirmDelete,
  cancelDelete,
  handleView,
  handleEdit,
  handleAddNewClick,
  handleBulkDelete,
  handleOrderClick,
  handleRowSelection,
}) => {
  // Columns (memoized)
  const columns = useMemo(() => [
    { field: "cat_name", headerName: "Course Name", flex: 1 },
    {
      field: "category_chinese_name",
      headerName: "Course Chinese Name",
      flex: 1,
    },
    {
      field: "categoryType",
      headerName: "Meal Type",
      valueGetter: (params) => {
        const typeId = params.row.type;
        const typeObj = _.find(type, { id: JSON.parse(typeId) });
        return typeObj ? typeObj.type_name : "N/A";
      },
    },
    {
      field: "parentId",
      headerName: "Parent Course",
      valueGetter: (params) => {
        const parentId = params.row.parent_id;
        const parentObj = _.find(categoryListData, { id: JSON.parse(parentId) });
        return parentObj ? parentObj.cat_name : "";
      },
      flex: 1,
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
  ], [canView, canEdit, canDelete, categoryListData, handleView, handleEdit, handleDelete]);

  return (
    <Box m="20px">
      <Header
        title="Course Details"
        icon={<DvrOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
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
              placeholder="Search by Course Name or Course Chinese Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: 1 }}
              onClick={() => setSearchText("")}
              aria-label={searchText ? "Clear search" : "Search"}
            >
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
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
              selectedIds.length > 0 && !selectedCategoryName
                ? `Are you sure you want to delete ${selectedIds.length} Course items?`
                : `Are you sure you want to delete the Course "${selectedCategoryName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Course Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default CategoryListView;
