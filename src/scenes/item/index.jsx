import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataItems, type } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  DvrOutlined,
  Home,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useSelector } from "react-redux";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import ItemServices from "../../services/itemServices";

const Item = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const perPageRecords = (10)
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const itemList = useSelector((state) => state.itemState.item);
  const [itemListData, setItemListData] = useState([])
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchALLItemsList()
  }, [itemList]);

  const fetchALLItemsList = async () => {
    try {
      const response = await ItemServices.getItemList();
      console.log(response)
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
  const handleDelete = (id) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log(`Delete confirmed for ID: ${selectedId}`);
    setDialogOpen(false); // Close the dialog
    // Add your delete logic here
  };

  const cancelDelete = () => {
    setDialogOpen(false); // Close the dialog
    setSelectedId(null);
  };

  const handleView = (id) => {
    const selectedRow = mockDataItems.find((row) => row.id === id);
    navigate(`/item-details/${id}`,  { state: { id }});
  };

  const handleEdit = (id) => {
    const selectedRow = mockDataItems.find((row) => row.id === id);
    navigate(`/item-details/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/item-details/create");
  };
  const handleOrderClick = () => {
    navigate("/item-details/order");
  };

  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)

  };


  const columns = [
    { field: "item_name", headerName: "item Name",flex: 1, },
    {
      field: "item_chinese_name",
      headerName: "item Chinese Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
    {
      field: "category", headerName: "Category",
      valueGetter: (params) => {
        const typeId = params.row.cat_id;
        const typeObj = type.find((t) => t.id === typeId);
        return typeObj ? typeObj.type_name : "N/A";
      },
      flex: 1
    },
    // Temperory Comments
    // { field: "isAllDay", headerName: "Is Allday", flex: 1 },
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
            >
              View
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(row.id)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDelete(row.id)}
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
          checkboxSelection
          components={{
            LoadingOverlay: CustomLoadingOverlay,
          }}
        />
        <ConfirmationDialog
          open={dialogOpen}
          title="Confirm Delete"
          message={`Are you sure you want to delete the "${mockDataItems.find((row) => row.id === selectedId)?.itemName || "selected"}" item?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Box>
    </Box>
  );
};

export default Item;

