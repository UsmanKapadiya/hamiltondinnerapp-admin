import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockOptions } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  Close,
  DvrOutlined,
  FormatListBulletedOutlined,
  Home,
  SearchOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ItemServices from "../../services/itemServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const ItemOptions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOptionName, setSelectedOptionName] = useState("");
  const [optionsListData, setpOptionsListData] = useState([])
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });


  useEffect(() => {
    fetchALLOptionsList()
  }, []);



  const fetchALLOptionsList = async () => {
    try {
      const response = await ItemServices.getOptionList();
      console.log(response)
      setpOptionsListData(response.data);
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
    setSelectedOptionName(data?.option_name);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedOptionName
      ? bulkDeleteOptions(selectedIds) : deleteOptions(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedOptionName()
  };

  const handleView = (id) => {
    navigate(`/item-options/${id}`, { state: { id } });
  };

  const handleEdit = (id) => {
    const selectedRow = optionsListData.find((row) => row.id === id);
    navigate(`/item-options/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/item-options/create");
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Option to delete.");
    }
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

  const bulkDeleteOptions = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await ItemServices.bulkdeleteOptions(data);
      setLoading(true)
      toast.success("Multiple Options Deleted successfully!");
      fetchALLOptionsList();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteOptions = async (id) => {
    try {
      setLoading(true);
      const response = await ItemServices.deleteOptions(id);
      console.log(response);
      toast.success("Options Deleted successfully!");
      fetchALLOptionsList();
      setSelectedOptionName("");
    } catch (error) {
      console.error("Error fetching Options list:", error);
      toast.error("Failed to process Option. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAdd = hasPermission(permissionList, "add_ItemOptions");
  const canView = hasPermission(permissionList, "read_ItemOptions");
  const canEdit = hasPermission(permissionList, "edit_ItemOptions");
  const canDelete = hasPermission(permissionList, "delete_ItemOptions");
  const canBrowse = hasPermission(permissionList, "browse_Options");



  const columns = [
    { field: "option_name", headerName: "Option Name", flex: 1, },
    {
      field: "option_name_cn",
      headerName: "Option Chinese Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
    {
      field: "is_paid_item",
      headerName: "Is Paid Item",
      renderCell: (params) => (params.value ? "Yes" : "No"),
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
        title="Item Options"
        icon={<FormatListBulletedOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
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
              placeholder="Search by Option Name, or Option Chinese Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: 1 }}
              onClick={() => setSearchText("")}
            >
              {searchText
                ? <Close />
                : <SearchOutlined />
              }
            </IconButton>
          </Box>
          <DataGrid
            rows={optionsListData.filter(
              (row) =>
                row.option_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                row.option_name_cn?.toLowerCase().includes(searchText.toLowerCase())
            )}
            columns={columns}
            loading={loading}
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            checkboxSelection
            onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedOptionName
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

