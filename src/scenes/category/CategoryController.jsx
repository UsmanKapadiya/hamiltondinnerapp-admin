import React from "react";

import {
  Box,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";

import {
  Close,
  DvrOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Header } from "../../components";
import { tokens } from "../../theme";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import useCategory from "./useCategory";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const permissionList =
    useSelector(
      (state) =>
        state?.permissionState
          ?.permissionsList
    );

  const {
    searchText,
    setSearchText,
    dialogOpen,
    selectedIds,
    selectedCategoryName,
    loading,
    filteredRows,
    columns,
    canAdd,
    canDelete,
    canBrowse,
    handleAddNewClick,
    handleBulkDelete,
    handleOrderClick,
    handleRowSelection,
    confirmDelete,
    cancelDelete,
  } = useCategory(permissionList);

  return (
    <Box m="20px">
      <Header
        title="Course Details"
        icon={<DvrOutlined />}
        addNewClick={
          handleAddNewClick
        }
        addBulkDelete={
          handleBulkDelete
        }
        orderClick={
          handleOrderClick
        }
        buttons={true}
        addButton={
          canAdd && canBrowse
        }
        deleteButton={
          canDelete && canBrowse
        }
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

            "& .MuiDataGrid-columnHeaders":
              {
                backgroundColor:
                  colors.blueAccent[700],

                borderBottom: "none",
              },

            "& .MuiDataGrid-virtualScroller":
              {
                backgroundColor:
                  colors.primary[400],
              },

            "& .MuiDataGrid-footerContainer":
              {
                borderTop: "none",

                backgroundColor:
                  colors.blueAccent[700],
              },

            "& .MuiCheckbox-root":
              {
                color: `${colors.greenAccent[200]} !important`,
              },
          }}
        >
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
              placeholder="Search by Course Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />

            <IconButton
              type="button"
              sx={{ p: 1 }}
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

          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={
              handleRowSelection
            }
            pageSizeOptions={[
              10,
              20,
              50,
              100,
            ]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            components={{
              LoadingOverlay:
                CustomLoadingOverlay,
            }}
          />

          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length >
                0 &&
              !selectedCategoryName
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

export default Category;
