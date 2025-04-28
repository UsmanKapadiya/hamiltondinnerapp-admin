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
import { useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const ItemPreferences = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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
    const selectedRow = mockPreferences.find((row) => row.id === id);
    navigate(`/item-preferences/${id}`, { state: selectedRow });
  };

  const handleEdit = (id) => {
    const selectedRow = mockPreferences.find((row) => row.id === id);
    navigate(`/item-preferences/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/item-preferences/create");
  };
  const handleOrderClick = () => {
    // navigate("/item-details/order");
  };

  const columns = [
    { field: "preferencesName", headerName: "Preferences Name",  flex: 1, },
    {
      field: "preferencesChineseName",
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
        title="Item Preferences"
        icon={<ClearAllOutlined />}
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
          rows={mockPreferences}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
        <ConfirmationDialog
          open={dialogOpen}
          title="Confirm Delete"
          message={`Are you sure you want to delete the "${mockPreferences.find((row) => row.id === selectedId)?.preferencesName || "selected"}" item?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </Box>
    </Box>
  );
};

export default ItemPreferences;

