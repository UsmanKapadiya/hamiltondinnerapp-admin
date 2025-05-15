import { Box, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  DvrOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useSelector } from "react-redux";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";

const Item = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItemName, setselectedItemName] = useState("");
  const [itemListData, setItemListData] = useState([])
  const [categoryListData, setCategoryListData] = useState([])
  const [optionsListData, setpOptionsListData] = useState([])
  const [peferencesListData, setpPeferencesListData] = useState([])
  const [loading, setLoading] = useState(true);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchALLItemsList()
    getCategoryListData()
    fetchALLOptionsList()
    fetchALLPreferenceList()
  }, []);

  const fetchALLPreferenceList = async () => {
    try {
      const response = await ItemServices.getPreferencesList();
      setpPeferencesListData(response.data);
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchALLOptionsList = async () => {
    try {
      const response = await ItemServices.getOptionList();
      setpOptionsListData(response.data);
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };


  const getCategoryListData = async () => {
    try {
      setLoading(true);
      const response = await CategoryServices.getCategoryList();
      setCategoryListData(response?.data)
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchALLItemsList = async () => {
    try {
      const response = await ItemServices.getItemList();
      setItemListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = (data) => {
    setSelectedIds([])
    setSelectedId(data?.id);
    setselectedItemName(data?.item_name);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedItemName
      ? bulkdeleteItem(selectedIds) : deleteItem(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setselectedItemName()
  };

  const handleView = (id) => {
    navigate(`/item-details/${id}`, {
      state: {
        id,
        categoryListData: categoryListData,
        optionsList: optionsListData,
        peferencesList: peferencesListData
      }
    });
  };

  const handleEdit = (id) => {
    const selectedRow = itemListData.find((row) => row.id === id);
    navigate(`/item-details/${id}/edit`, {
      state: {
        selectedRow,
        categoryListData,
        optionsList: optionsListData,
        peferencesList: peferencesListData,
      },
    });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/item-details/create", {
      state:
      {
        categoryListData: categoryListData,
        optionsList: optionsListData,
        peferencesList: peferencesListData
      }
    });
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Item to delete.");
    }
  };
  const handleOrderClick = () => {
    navigate("/item-details/order");
  };

  const handleRowSelection = (ids) => {
    setSelectedIds(ids);
  };


  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)
  };

  const bulkdeleteItem = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await ItemServices.bulkdeleteItems(data);
      // console.log(response)
      setLoading(true)
      toast.success("Multiple Items Deleted successfully!");
      fetchALLItemsList();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteItem = async (id) => {
    try {
      const response = await ItemServices.deleteItems(id);
      // console.log(response)
      setLoading(true)
      toast.success("Item Deleted successfully!");
      fetchALLItemsList();
      setselectedItemName("");
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAdd = hasPermission(permissionList, "add_ItemDetails");
  const canView = hasPermission(permissionList, "read_ItemDetails");
  const canEdit = hasPermission(permissionList, "edit_ItemDetails");
  const canDelete = hasPermission(permissionList, "delete_ItemDetails");

  const columns = [
    { field: "item_name", headerName: "item Name", flex: 1, },
    {
      field: "item_chinese_name",
      headerName: "item Chinese Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
    {
      field: "category", headerName: "Category",
      valueGetter: (params) => {
        const typeId = params?.row?.cat_id;
        const typeObj = categoryListData.find((t) => t.id === typeId);
        return typeObj ? typeObj.cat_name : "N/A";
      },
      flex: 1,

    },
    // Temperory Comments
    { field: "is_allday", headerName: "Is Allday" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
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
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="item Details"
        icon={<DvrOutlined />}
        Buttons={true}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
      />
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
        <DataGrid
          rows={itemListData}
          columns={columns}
          loading={loading}
          rowCount={pagination.total}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={handlePaginationChange}
          onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
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
              ? `Are you sure you want to delete ${selectedIds.length} Option items?`
              : `Are you sure you want to delete the Option "${selectedItemName}"?`
          }
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Box>
    </Box>
  );
};

export default Item;

