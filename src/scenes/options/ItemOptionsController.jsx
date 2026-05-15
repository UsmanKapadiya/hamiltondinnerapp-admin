import {
    Box,
    Button,
    IconButton,
    InputBase,
    useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    Close,
    FormatListBulletedOutlined,
    SearchOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import { tokens } from "../../theme";
import useItemOptions from "./useItemOptions";

const ItemOptions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

    const {
        searchText,
        setSearchText,
        dialogOpen,
        selectedIds,
        selectedOptionName,
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
    } = useItemOptions(permissionList);

    return (
        <Box m="20px">
            <Header
                title="Menu Item Options"
                icon={<FormatListBulletedOutlined />}
                addNewClick={handleAddNewClick}
                addBulkDelete={handleBulkDelete}
                buttons
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

                        "& .MuiCheckbox-root": {
                            color: `${colors.greenAccent[200]} !important`,
                        },

                        "& .MuiDataGrid-iconSeparator":
                        {
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
                            placeholder="Search by Option Name, or Option Chinese Name..."
                            sx={{ ml: 2, flex: 1 }}
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
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
                        rowCount={filteredRows.length}
                        paginationModel={{
                            page: pagination.page - 1,
                            pageSize: pagination.pageSize,
                        }}
                        onPaginationModelChange={
                            handlePaginationChange
                        }
                        checkboxSelection
                        onRowSelectionModelChange={
                            handleRowSelection
                        }
                        components={{
                            LoadingOverlay:
                                CustomLoadingOverlay,
                        }}
                    />

                    <ConfirmationDialog
                        open={dialogOpen}
                        title="Confirm Delete"
                        message={
                            selectedIds.length > 0 &&
                                !selectedOptionName
                                ? `Are you sure you want to delete ${selectedIds.length} Option items?`
                                : `Are you sure you want to delete the Option "${selectedOptionName}"?`
                        }
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                </Box>
            ) : (
                <NoPermissionMessage
                    title="You do not have permission to view Options Details."
                    message="Please contact your administrator if you believe this is a mistake."
                />
            )}
        </Box>
    );
};

export default ItemOptions;
