import { Box, useTheme } from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { useEffect, useState, useCallback, useMemo } from "react";
import ItemServices from "../../services/itemServices";
import { useDispatch } from "react-redux";
import { setItemList } from "../../redux/action/itemAction";
import RoleServices from "../../services/roleServices";
import { setPermissionList } from "../../redux/action/permissionAction";

function Dashboard() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemListData, setItemListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize userData to avoid re-parsing on every render
  const userData = useMemo(() => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }, []);

  const fetchItemsList = useCallback(async () => {
    try {
      const response = await ItemServices.getItemList();
      dispatch(setItemList(response.data));
      setItemListData(response.data);
    } catch (error) {
      console.error("Error fetching items list:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const fetchGetRoleById = useCallback(async (id) => {
    try {
      const response = await RoleServices.getRoleById(id);
      dispatch(setPermissionList(response?.data?.permission_list));
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    fetchItemsList();
  }, [fetchItemsList]);

  useEffect(() => {
    if (userData?.role_id) {
      fetchGetRoleById(userData.role_id);
    }
  }, [userData?.role_id, fetchGetRoleById]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
    </Box>
  );
}

export default Dashboard;
