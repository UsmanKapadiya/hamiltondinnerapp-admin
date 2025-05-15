import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Close,
  Home,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import RoomServices from "../../services/roomServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { hasPermission } from "../../components/permissions";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const Room = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [roomListData, setroomListData] = useState([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  console.log(permissionList)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });


  useEffect(() => {
    fetchALLRoomList()
  }, []);

  const fetchALLRoomList = async () => {
    try {
      const response = await RoomServices.getRoomList();
      setroomListData(response.data);
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
    setSelectedIds([])
    setSelectedId(data?.id);
    setSelectedRoomName(data?.room_name);
    setDialogOpen(true);
  };
  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedRoomName
      ? bulkDeleteRoom(selectedIds) : deleteRoom(selectedId);
    setDialogOpen(false);
  };
  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedRoomName("");
  };
  const handleView = (id) => {
    navigate(`/room-details/${id}`, { state: { id } });
  };
  const handleEdit = (id) => {
    const selectedRow = roomListData.find((row) => row.id === id);
    navigate(`/room-details/${id}/edit`, { state: selectedRow });
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/room-details/create");
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Room to delete.");
    }
  };
  const handleOrderClick = () => {
    navigate("/room-details/order");
  };
  const handlePaginationChange = (newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1,)
  };



  // Usage example in your component:
  const canAdd = hasPermission(permissionList, "add_RoomDetails");
  const canView = hasPermission(permissionList, "read_RoomDetails");
  const canEdit = hasPermission(permissionList, "edit_RoomDetails");
  const canDelete = hasPermission(permissionList, "delete_RoomDetails");
  const canBrowseRoom = hasPermission(permissionList, "browse_Room");


  const columns = [
    { field: "room_name", headerName: "Unit Number" },
    {
      field: "resident_name",
      headerName: "Resident Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
    {
      field: "occupancy",
      headerName: "Occupancy",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "language", headerName: "Language Preference",
      renderCell: ({ value }) => {
        return (
          <Typography>
            {value === "0" || value === 0 ? "Chinese" : "English"}
          </Typography>
        );
      },
    },
    {
      field: "is_active",
      headerName: "Active",
      flex: 1,
      renderCell: ({ row: { is_active } }) => {
        return (
          <Box
            width="120px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            bgcolor={
              is_active === 1
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={1}
          >
            {/* {is_active === 1 && <AdminPanelSettingsOutlined />}
            {is_active === 0 && <SecurityOutlined />} */}
            <Typography textTransform="capitalize">
              {is_active === 1 ? "active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
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

  const bulkDeleteRoom = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await RoomServices.bulkdeleteRooms(data);
      setLoading(true)
      toast.success("Multiple Rooms Deleted successfully!");
      fetchALLRoomList();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteRoom = async (id) => {
    try {
      const response = await RoomServices.deleteRooms(id);
      // console.log(response)
      setLoading(true)
      toast.success("Rooms Deleted successfully!");
      fetchALLRoomList();
      setSelectedRoomName("");
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box m="20px">
      <Header
        title="Room Details"
        icon={<Home />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
        addButton={canAdd && canBrowseRoom}
        deleteButton={canDelete && canBrowseRoom}
      />
      {canBrowseRoom ? (
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
          // sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
          >
            <InputBase
              placeholder="Search by Unit Number, or Resident Name..."
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
            rows={roomListData.filter(
              (row) =>
                row.room_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                row.resident_name?.toLowerCase().includes(searchText.toLowerCase())
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
              selectedIds.length > 0 && !selectedRoomName
                ? `Are you sure you want to delete ${selectedIds.length} Room${selectedIds.length > 1 ? 's' : ''}?` // Handles singular/plural for multiple room delete
                : `Are you sure you want to delete the Room "${selectedRoomName}"?` // Single room delete message
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />

        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Room Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default Room;

