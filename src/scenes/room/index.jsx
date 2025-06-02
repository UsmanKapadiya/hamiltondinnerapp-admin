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
import { useEffect, useState, useMemo, useCallback } from "react";
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
  const [roomListData, setRoomListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Memoize permissions for performance
  const canAdd = useMemo(() => hasPermission(permissionList, "add_RoomDetails"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_RoomDetails"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_RoomDetails"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_RoomDetails"), [permissionList]);
  const canBrowseRoom = useMemo(() => hasPermission(permissionList, "browse_Room"), [permissionList]);

  // Fetch room list
  const fetchALLRoomList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await RoomServices.getRoomList();
      setRoomListData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      console.error("Error fetching room list:", error);
      toast.error("Failed to fetch room list. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchALLRoomList();
  }, [fetchALLRoomList]);

  // Memoize filtered rows for DataGrid
  const filteredRows = useMemo(() => {
    const search = searchText.toLowerCase();
    return roomListData.filter(
      (row) =>
        row.room_name?.toLowerCase().includes(search) ||
        row.resident_name?.toLowerCase().includes(search)
    );
  }, [roomListData, searchText]);

  // Memoize columns to avoid unnecessary re-renders
  const columns = useMemo(() => [
    { field: "room_name", headerName: "Unit Number" },
    {
      field: "resident_name",
      headerName: "Resident Name",
      flex: 1,
    },
    {
      field: "occupancy",
      headerName: "Occupancy",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "language",
      headerName: "Language Preference",
      renderCell: ({ value }) => (
        <Typography>
          {value === "0" || value === 0 ? "Chinese" : "English"}
        </Typography>
      ),
    },
    {
      field: "is_active",
      headerName: "Active",
      flex: 1,
      renderCell: ({ row: { is_active } }) => (
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
          <Typography textTransform="capitalize">
            {is_active === "1" ? "Active" : "Inactive"}
          </Typography>
        </Box>
      ),
    },
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
  ], [canView, canEdit, canDelete, colors]);

  // Handlers
  const handleRowSelection = useCallback((ids) => setSelectedIds(ids), []);
  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedRoomName(data?.room_name);
    setDialogOpen(true);
  }, []);
  
  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedRoomName
      ? bulkDeleteRoom(selectedIds)
      : deleteRoom(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedRoomName, selectedId]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedRoomName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/room-details/${id}`, { state: { id } });
  }, [navigate]);

  const handleEdit = useCallback((id) => {
    const selectedRow = roomListData.find((row) => row.id === id);
    navigate(`/room-details/${id}/edit`, { state: selectedRow });
  }, [navigate, roomListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/room-details/create");
  }, [navigate]);
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Room to delete.");
    }
  }, [selectedIds]);
  const handlePaginationChange = useCallback((newPaginationModel) => {
    setPagination((prev) => ({
      ...prev,
      page: newPaginationModel.page + 1,
      pageSize: newPaginationModel.pageSize,
    }));
    setCurrentPage(newPaginationModel.page + 1);
  }, []);

  // Bulk delete and single delete
  const bulkDeleteRoom = useCallback(async (ids) => {
    try {
      let data = JSON.stringify({ ids });
      await RoomServices.bulkdeleteRooms(data);
      setLoading(true);
      toast.success("Multiple Rooms Deleted successfully!");
      fetchALLRoomList();
    } catch (error) {
      console.error("Error deleting rooms:", error);
      toast.error("Failed to process rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLRoomList]);
  const deleteRoom = useCallback(async (id) => {
    try {
      await RoomServices.deleteRooms(id);
      setLoading(true);
      toast.success("Room Deleted successfully!");
      fetchALLRoomList();
      setSelectedRoomName("");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to process room. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchALLRoomList]);

  return (
    <Box m="20px">
      <Header
        title="Room Details"
        icon={<Home />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        buttons={true}
        addButton={canAdd && canBrowseRoom}
        deleteButton={canDelete && canBrowseRoom}
      />
      {canBrowseRoom ? (
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
              placeholder="Search by Unit Number or Resident Name..."
              sx={{ ml: 2, flex: 1 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: 1 }}
              onClick={() => setSearchText("")}
              aria-label={searchText ? "Clear search" : "Search"}
            >
              {searchText ? <Close /> : <SearchOutlined />}
            </IconButton>
          </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            rowCount={pagination.total}
            paginationModel={{
              page: pagination.page - 1,
              pageSize: pagination.pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            checkboxSelection
            onRowSelectionModelChange={handleRowSelection}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
            pageSizeOptions={[10, 20, 50, 100]} 
          />

          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedRoomName
                ? `Are you sure you want to delete ${selectedIds.length} Room${selectedIds.length > 1 ? "s" : ""}?`
                : `Are you sure you want to delete the Room "${selectedRoomName}"?`
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