import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockPreferences } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  ClearAllOutlined,
  DvrOutlined,
  FormatListBulletedOutlined,
  Home,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";

const ItemPreferences = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPreferenceName, setSelectedPreferenceName] = useState("");
  const [preferencesListData, setpPeferencesListData] = useState([])
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchALLPreferenceList()
  }, []);

  const fetchALLPreferenceList = async () => {
    try {
      const response = await ItemServices.getPreferencesList();
      console.log(response)
      setpPeferencesListData(response.data);
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

  const handleRowSelection = (ids) => {
    setSelectedIds(ids);
  };

  const handleDelete = (data) => {
    console.log(data)
    setSelectedIds([])
    setSelectedId(data?.id);
    setSelectedPreferenceName(data?.pname);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedPreferenceName
      ? bulkDeletePreference(selectedIds) : deletePreference(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedPreferenceName()
  };

  const handleView = (id) => {
    navigate(`/item-preferences/${id}`, { state: { id } });
  };

  const handleEdit = (id) => {
    const selectedRow = preferencesListData.find((row) => row.id === id);
    navigate(`/item-preferences/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/item-preferences/create");
  };
  const handleBulkDelete = () => {
    setDialogOpen(true);
  };
  const handleOrderClick = () => {
    // navigate("/item-details/order");
  };

  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)
  };

  const bulkDeletePreference = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await ItemServices.bulkdeletePreferences(data);
      setLoading(true)
      toast.success("Multiple Preferences Deleted successfully!");
      fetchALLPreferenceList();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deletePreference = async (id) => {
    try {
      const response = await ItemServices.deletePreferences(id);
      console.log(response)
      setLoading(true)
      toast.success("Preference Deleted successfully!");
      fetchALLPreferenceList();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    { field: "pname", headerName: "Preferences Name", flex: 1, },
    {
      field: "pname_cn",
      headerName: "Preferences Chinese Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
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
              onClick={() => handleDelete(row)}
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
        title="Item Preferences"
        icon={<ClearAllOutlined />}
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
          rows={preferencesListData}
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
            selectedIds.length > 0 && !selectedPreferenceName
              ? `Are you sure you want to Preference ${selectedIds.length}  items?`
              : `Are you sure you want to delete the Preference "${selectedPreferenceName}"?`
          } 
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Box>
    </Box>
  );
};

export default ItemPreferences;

