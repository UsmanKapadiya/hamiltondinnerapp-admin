import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import RoomServices from "../../services/roomServices";
import { hasPermission } from "../../components/permissions";

const useRoom = () => {
  const navigate = useNavigate();

  const permissionList = useSelector(
    (state) => state?.permissionState?.permissionsList
  );

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedRoomName, setSelectedRoomName] = useState("");

  const [roomListData, setRoomListData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // permissions
  const permissions = useMemo(() => {
    const base = {
      canAdd: hasPermission(permissionList, "add_RoomDetails"),

      canView: hasPermission(permissionList, "read_RoomDetails"),

      canEdit: hasPermission(permissionList, "edit_RoomDetails"),

      canDelete: hasPermission(permissionList, "delete_RoomDetails"),

      canBrowse: hasPermission(permissionList, "browse_Room"),

      isSuperAdmin: userData?.role === "superadmin",
    };

    return {
      ...base,

      canShowAdd:
        (base.canAdd && base.canBrowse) || base.isSuperAdmin,

      canShowDelete:
        (base.canDelete && base.canBrowse) || base.isSuperAdmin,
    };
  }, [permissionList, userData]);

  // fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);

      const res = await RoomServices.getRoomList();

      setRoomListData(res.data);

      setPagination((prev) => ({
        ...prev,
        total: res.count,
      }));
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch resident list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // handlers
  const handleView = useCallback(
    (id) => {
      navigate(`/resident-details/${id}`, {
        state: { id },
      });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      const selectedRow = roomListData.find(
        (row) => row.id === id
      );

      navigate(`/resident-details/${id}/edit`, {
        state: selectedRow,
      });
    },
    [navigate, roomListData]
  );

  const handleAdd = () => {
    navigate("/resident-details/create");
  };

  const handleDeleteClick = (row) => {
    setSelectedIds([]);
    setSelectedId(row.id);
    setSelectedRoomName(row.room_name);
    setDialogOpen(true);
  };

  // delete single
  const deleteSingle = async (id) => {
    try {
      await RoomServices.deleteRooms(id);

      toast.success("Resident Deleted Successfully");

      fetchRooms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete resident.");
    }
  };

  // delete bulk
  const deleteBulk = async (ids) => {
    try {
      await RoomServices.bulkdeleteRooms(
        JSON.stringify({ ids })
      );

      toast.success("Residents Deleted Successfully");

      fetchRooms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete residents.");
    }
  };

  // confirm delete
  const confirmDelete = () => {
    const isBulk =
      selectedIds.length > 0 && !selectedRoomName;

    isBulk
      ? deleteBulk(selectedIds)
      : deleteSingle(selectedId);

    setDialogOpen(false);
  };

  // cancel delete
  const cancelDelete = () => {
    setDialogOpen(false);

    setSelectedId(null);

    setSelectedRoomName("");
  };

  // bulk delete click
  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      toast.warning(
        "Please select at least one Resident."
      );

      return;
    }

    setDialogOpen(true);
  };

  // search filter
  const filteredRooms = useMemo(() => {
    return roomListData.filter(
      (row) =>
        row.room_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.resident_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
    );
  }, [roomListData, searchText]);

  return {
    searchText,
    setSearchText,

    dialogOpen,

    selectedRoomName,

    selectedIds,
    setSelectedIds,

    loading,

    filteredRooms,

    pagination,
    setPagination,

    permissions,

    handleView,
    handleEdit,
    handleAdd,

    handleDeleteClick,

    handleBulkDelete,

    confirmDelete,
    cancelDelete,
  };
};

export default useRoom;
