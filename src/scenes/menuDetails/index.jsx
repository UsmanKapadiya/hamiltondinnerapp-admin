import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockMenuDetailsData } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  ClearAllOutlined,
  CreateOutlined,
  DvrOutlined,
  FormatListBulletedOutlined,
  Home,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import MenuServices from "../../services/menuServices";

const MenuDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const perPageRecords = (10)
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  useEffect(() => {
    fetchMenuList();
    setLoading(true)
  }, [pagination.page, pagination.pageSize]);

  const fetchMenuList = async () => {
    try {
      const response = await MenuServices.getMenuList({ currentPage, perPageRecords });
      setMenuList(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteMenu = async (id) => {
    try {
      const response = await MenuServices.deleteMenus(id);
      console.log(response)
      toast.success("Menu Deleted successfully!");
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
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
    console.log(selectedId)
    deleteMenu(selectedId)
    setDialogOpen(false); // Close the dialog
    // Add your delete logic here
  };

  const cancelDelete = () => {
    setDialogOpen(false); // Close the dialog
    setSelectedId(null);
  };

  const handleView = (id) => {
    const selectedRow = menuList.find((row) => row.id === id);
    navigate(`/menu-details/${id}`, { state: selectedRow });
  };

  const handleEdit = (id) => {
    const selectedRow = menuList.find((row) => row.id === id);
    navigate(`/menu-details/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/menu-details/create");
  };
  const handleOrderClick = () => {
    // navigate("/item-details/order");
  };

  const columns = [
    { field: "menu_name", headerName: "Menu Name", flex: 1, },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
      },
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
              onClick={() => handleDelete(row.id)}
            >
              Delete
            </Button>

          </Box>
        );
      },
    },
  ];

  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1, // DataGrid uses 0-based indexing for pages
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)

  };

  return (
    <Box m="20px">
      <Header
        title="Menu Details"
        icon={<CreateOutlined />}
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
          rows={menuList}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={pagination.total} 
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={handlePaginationChange}
          checkboxSelection
        />
        <ConfirmationDialog
          open={dialogOpen}
          title="Confirm Delete"
          message={`Are you sure you want to delete the "${mockMenuDetailsData.find((row) => row.id === selectedId)?.menuName || "selected"}" item?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Box>
    </Box>
  );
};

export default MenuDetails;

