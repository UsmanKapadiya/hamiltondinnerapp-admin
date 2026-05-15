    import {
  Box,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  ClearAllOutlined,
  Close,
  SearchOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import { tokens } from "../../theme";
import useItemPreferences from "./useItemPreferences";

const ItemPreferences = () => {
  const theme = useTheme();

  const colors = tokens(
    theme.palette.mode
  );

  const permissionList = useSelector(
    (state) =>
      state?.permissionState
        ?.permissionsList
  );

  const {
    searchText,
    setSearchText,
    dialogOpen,
    selectedIds,
    selectedPreferenceName,
    loading,
    pagination,
    filteredRows,
    columns,
    canAdd,
    canDelete,
    canBrowse,
    handleAddNewClick,
    handleBulkDelete,
    handlePaginationChange,
    handleRowSelection,
    confirmDelete,
    cancelDelete,
  } = useItemPreferences(
    permissionList
  );

  return (
    <Box m="20px">
      <Header
        title="Menu Item Preferences"
        icon={<ClearAllOutlined />}
        addNewClick={
          handleAddNewClick
        }
        addBulkDelete={
          handleBulkDelete
        }
        buttons
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
            "& .MuiDataGrid-root":
              {
                border: "none",
              },

            "& .MuiDataGrid-cell":
              {
                border: "none",
              },

            "& .name-column--cell":
              {
                color:
                  colors
                    .greenAccent[300],
              },

            "& .MuiDataGrid-columnHeaders":
              {
                backgroundColor:
                  colors
                    .blueAccent[700],

                borderBottom:
                  "none",
              },

            "& .MuiDataGrid-virtualScroller":
              {
                backgroundColor:
                  colors
                    .primary[400],
              },

            "& .MuiDataGrid-footerContainer":
              {
                borderTop:
                  "none",

                backgroundColor:
                  colors
                    .blueAccent[700],
              },

            "& .MuiCheckbox-root":
              {
                color: `${colors.greenAccent[200]} !important`,
              },

            "& .MuiDataGrid-iconSeparator":
              {
                color:
                  colors
                    .primary[100],
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
              placeholder="Search by Preference Name, or Preference Chinese Name..."
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
            rowCount={
              filteredRows.length
            }
            paginationModel={{
              page:
                pagination.page -
                1,

              pageSize:
                pagination.pageSize,
            }}
            onPaginationModelChange={
              handlePaginationChange
            }
            onRowSelectionModelChange={
              handleRowSelection
            }
            checkboxSelection
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
              !selectedPreferenceName
                ? `Are you sure you want to delete ${selectedIds.length} Preferences?`
                : `Are you sure you want to delete the Preference "${selectedPreferenceName}"?`
            }
            onConfirm={
              confirmDelete
            }
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Preferences Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default ItemPreferences;
