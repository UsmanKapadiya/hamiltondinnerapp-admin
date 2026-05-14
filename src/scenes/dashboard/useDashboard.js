import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useDispatch } from "react-redux";

import ItemServices from "../../services/itemServices";

import RoleServices from "../../services/roleServices";

import {
  setItemList,
} from "../../redux/action/itemAction";

import {
  setPermissionList,
} from "../../redux/action/permissionAction";

const useDashboard = () => {
  const dispatch = useDispatch();

  const [itemListData, setItemListData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // Prevent re-creating object on every render
  const userData = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("userData")
    );
  }, []);

  /**
   * Fetch Items List
   */
  const fetchItemsList =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await ItemServices.getItemList();

        dispatch(
          setItemList(response.data)
        );

        setItemListData(response.data);
      } catch (error) {
        console.error(
          "Error fetching item list:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, [dispatch]);

  /**
   * Fetch Role Permissions
   */
  const fetchGetRoleById =
    useCallback(
      async (id) => {
        if (!id) return;

        try {
          setLoading(true);

          const response =
            await RoleServices.getRoleById(id);

          dispatch(
            setPermissionList(
              response?.data
                ?.permission_list || []
            )
          );
        } catch (error) {
          console.error(
            "Error fetching role permissions:",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      [dispatch]
    );

  /**
   * Initial API Calls
   */
  useEffect(() => {
    fetchItemsList();

    if (userData?.role_id) {
      fetchGetRoleById(
        userData.role_id
      );
    }
  }, [
    fetchItemsList,
    fetchGetRoleById,
    userData?.role_id,
  ]);

  return {
    loading,
    itemListData,
  };
};

export default useDashboard;
