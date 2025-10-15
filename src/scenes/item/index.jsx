import { Box, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  DvrOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useSelector } from "react-redux";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";
import NoPermissionMessage from "../../components/NoPermissionMessage";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Item = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 300);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [itemListData, setItemListData] = useState([]);
  const [categoryListData, setCategoryListData] = useState([]);
  const [optionsListData, setOptionsListData] = useState([]);
  const [preferencesListData, setPreferencesListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Permissions
  const canAdd = hasPermission(permissionList, "add_ItemDetails");
  const canView = hasPermission(permissionList, "read_ItemDetails");
  const canEdit = hasPermission(permissionList, "edit_ItemDetails");
  const canDelete = hasPermission(permissionList, "delete_ItemDetails");
  const canBrowse = hasPermission(permissionList, "browse_Item");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ItemServices.getItemList(),
      CategoryServices.getCategoryList(),
      ItemServices.getOptionList(),
      ItemServices.getPreferencesList(),
    ])
      .then(([itemRes, catRes, optRes, prefRes]) => {
        setItemListData(itemRes.data);
        setPagination((prev) => ({
          ...prev,
          total: itemRes.count,
        }));
        setCategoryListData(catRes?.data || []);
        setOptionsListData(optRes.data || []);
        setPreferencesListData(prefRes.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Memoized filtered rows
  const filteredRows = useMemo(() => {
    if (!debouncedSearch) return itemListData;
    const search = debouncedSearch.toLowerCase();
    return itemListData.filter(
      (row) =>
        row.item_name?.toLowerCase().includes(search) ||
        row.item_chinese_name?.toLowerCase().includes(search)
    );
  }, [itemListData, debouncedSearch]);

  // Memoized columns
  const columns = useMemo(() => [
    { field: "item_name", headerName: "Menu Item Name", flex: 1 },
    {
      field: "item_chinese_name",
      headerName: "Menu Item Chinese Name",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Course",
      valueGetter: (params) => {
        const typeId = params?.row?.cat_id;
        const typeObj = categoryListData.find((t) => t.id === typeId);
        return typeObj ? typeObj.cat_name : "N/A";
      },
      flex: 1,
    },
    // { field: "is_allday", headerName: "Is Allday" },
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
  ], [categoryListData, canView, canEdit, canDelete]);

  // Handlers with useCallback
  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedItemName(data?.item_name);
    setDialogOpen(true);
  }, []);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    try {
      await ItemServices.deleteItems(id);
      toast.success("Menu Item Deleted successfully!");
      // Refresh list
      const response = await ItemServices.getItemList();
      setItemListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
      setSelectedItemName("");
    } catch (error) {
      console.error("Error deleting Menu item:", error);
      toast.error("Failed to delete Menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteItems = useCallback(async (ids) => {
    setLoading(true);
    try {
      await ItemServices.bulkdeleteItems(JSON.stringify({ ids }));
      toast.success("Multiple Items Deleted successfully!");
      // Refresh list
      const response = await ItemServices.getItemList();
      setItemListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedIds.length > 0 && !selectedItemName) {
      bulkDeleteItems(selectedIds);
    } else {
      deleteItem(selectedId);
    }
    setDialogOpen(false);
  }, [selectedIds, selectedItemName, selectedId, bulkDeleteItems, deleteItem]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedItemName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/menu-item-details/${id}`, {
      state: {
        id,
        categoryListData,
        optionsList: optionsListData,
        preferencesList: preferencesListData,
      },
    });
  }, [navigate, categoryListData, optionsListData, preferencesListData]);

  const handleEdit = useCallback((id) => {
    const selectedRow = itemListData.find((row) => row.id === id);
    navigate(`/menu-item-details/${id}/edit`, {
      state: {
        selectedRow,
        categoryListData,
        optionsList: optionsListData,
        preferencesList: preferencesListData,
      },
    });
  }, [navigate, itemListData, categoryListData, optionsListData, preferencesListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/menu-item-details/create", {
      state: {
        categoryListData,
        optionsList: optionsListData,
        preferencesList: preferencesListData,
      },
    });
  }, [navigate, categoryListData, optionsListData, preferencesListData]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Menu Item to delete.");
    }
  }, [selectedIds]);

  const handleOrderClick = useCallback(() => {
    navigate("/menu-item-details/order");
  }, [navigate]);

  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Menu Item Details"
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
              placeholder="Search by Menu Item Name, or Menu Item Chinese Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: 1 }}
              onClick={() => setSearchText("")}
            >
              {searchText ? <Close /> : <SearchOutlined />}
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
            onPaginationModelChange={handlePaginationChange}
            onRowSelectionModelChange={handleRowSelection}
            checkboxSelection
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
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
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Menu Item Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default Item;
