import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { toast } from "react-toastify";

import MenuServices from "../../services/menuServices";

import ItemServices from "../../services/itemServices";

import {
  setItemList,
} from "../../redux/action/itemAction";

import { hasPermission } from "../../components/permissions";

const useMenuDetails = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const permissionList =
    useSelector(
      (state) =>
        state?.permissionState
          ?.permissionsList
    );

  const [searchText, setSearchText] =
    useState("");

  const [debouncedSearch,
    setDebouncedSearch] =
    useState("");

  const [dialogOpen,
    setDialogOpen] =
    useState(false);

  const [selectedId,
    setSelectedId] =
    useState(null);

  const [selectedIds,
    setSelectedIds] =
    useState([]);

  const [selectedMenuName,
    setSelectedMenuName] =
    useState("");

  const [menuList,
    setMenuList] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [pagination,
    setPagination] =
    useState({
      page: 1,
      pageSize: 100,
      total: 0,
    });

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(
        searchText
      );
    }, 300);

    return () =>
      clearTimeout(handler);
  }, [searchText]);

  // Fetch Menus
  const fetchMenuList =
    useCallback(async () => {
      try {
        setLoading(true);

        const isDateSearch =
          /^\d{1,2}-\d{1,2}-\d{4}$/.test(
            debouncedSearch
          ) ||
          /^\d{1,2}-\d{1,2}$/.test(
            debouncedSearch
          );

        const response =
          await MenuServices.getMenuList(
            {
              currentPage:
                pagination.page,

              perPageRecords:
                pagination.pageSize,

              search:
                isDateSearch
                  ? ""
                  : debouncedSearch,
            }
          );

        setMenuList(response.data);

        setPagination((prev) => ({
          ...prev,
          total:
            response.pagination
              .total,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [
      pagination.page,
      pagination.pageSize,
      debouncedSearch,
    ]);

  // Fetch Items
  const fetchItemsList =
    useCallback(async () => {
      try {
        const response =
          await ItemServices.getItemList();

        dispatch(
          setItemList(response.data)
        );
      } catch (error) {
        console.error(error);
      }
    }, [dispatch]);

  // Initial Load
  useEffect(() => {
    fetchMenuList();

    fetchItemsList();
  }, [
    fetchMenuList,
    fetchItemsList,
  ]);

  // Delete Single
  const deleteMenu =
    useCallback(
      async (id) => {
        try {
          setLoading(true);

          await MenuServices.deleteMenus(
            id
          );

          toast.success(
            "Menu Deleted successfully!"
          );

          fetchMenuList();
        } catch (error) {
          toast.error(
            "Failed to delete menu"
          );
        } finally {
          setLoading(false);
        }
      },
      [fetchMenuList]
    );

  // Delete Bulk
  const bulkDeleteMenu =
    useCallback(
      async (ids) => {
        try {
          setLoading(true);

          await MenuServices.bulkdeleteMenus(
            JSON.stringify({
              ids,
            })
          );

          toast.success(
            "Menus deleted successfully!"
          );

          fetchMenuList();
        } catch (error) {
          toast.error(
            "Failed to delete menus"
          );
        } finally {
          setLoading(false);
        }
      },
      [fetchMenuList]
    );

  // View
  const handleView =
    useCallback(
      (id) => {
        const selectedRow =
          menuList.find(
            (row) =>
              row.id === id
          );

        navigate(
          `/menu-details/${id}`,
          {
            state:
              selectedRow,
          }
        );
      },
      [menuList, navigate]
    );

  // Edit
  const handleEdit =
    useCallback(
      (id) => {
        const selectedRow =
          menuList.find(
            (row) =>
              row.id === id
          );

        navigate(
          `/menu-details/${id}/edit`,
          {
            state:
              selectedRow,
          }
        );
      },
      [menuList, navigate]
    );

  // Add
  const handleAddNewClick =
    () => {
      navigate(
        "/menu-details/create"
      );
    };

  // Delete Click
  const handleDeleteClick =
    useCallback((row) => {
      setSelectedId(row.id);

      const dateObj =
        new Date(row.date);

      const formattedDate = `${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-${dateObj
          .getDate()
          .toString()
          .padStart(
            2,
            "0"
          )}-${dateObj.getFullYear()}`;

      setSelectedMenuName(
        formattedDate
      );

      setDialogOpen(true);
    }, []);

  // Confirm Delete
  const confirmDelete =
    useCallback(() => {
      const isBulk =
        selectedIds.length > 0 &&
        !selectedMenuName;

      isBulk
        ? bulkDeleteMenu(
            selectedIds
          )
        : deleteMenu(
            selectedId
          );

      setDialogOpen(false);
    }, [
      selectedIds,
      selectedMenuName,
      selectedId,
      bulkDeleteMenu,
      deleteMenu,
    ]);

  // Cancel Delete
  const cancelDelete = () => {
    setDialogOpen(false);

    setSelectedId(null);

    setSelectedMenuName("");
  };

  // Bulk Delete
  const handleBulkDelete =
    () => {
      if (!selectedIds.length) {
        toast.warning(
          "Please select at least one menu"
        );

        return;
      }

      setSelectedId(null);

      setDialogOpen(true);
    };

  // Permissions
  const permissions =
    useMemo(() => ({
      canAdd:
        hasPermission(
          permissionList,
          "add_Menus"
        ),

      canView:
        hasPermission(
          permissionList,
          "read_Menus"
        ),

      canEdit:
        hasPermission(
          permissionList,
          "edit_Menus"
        ),

      canDelete:
        hasPermission(
          permissionList,
          "delete_Menus"
        ),

      canBrowse:
        hasPermission(
          permissionList,
          "browse_Menus"
        ),
    }), [permissionList]);

  // Filter
  const filteredRows =
    useMemo(() => {
      if (!debouncedSearch) {
        return menuList;
      }

      return menuList.filter(
        (row) => {
          if (!row.date)
            return false;

          const dateObj =
            new Date(
              row.date
            );

          const formattedDate = `${(
            dateObj.getMonth() +
            1
          )
            .toString()
            .padStart(
              2,
              "0"
            )}-${dateObj
              .getDate()
              .toString()
              .padStart(
                2,
                "0"
              )}-${dateObj.getFullYear()}`;

          return formattedDate
            .toLowerCase()
            .includes(
              debouncedSearch.toLowerCase()
            );
        }
      );
    }, [
      menuList,
      debouncedSearch,
    ]);

  return {
    searchText,
    setSearchText,

    dialogOpen,

    selectedMenuName,

    selectedIds,
    setSelectedIds,

    loading,

    filteredRows,

    pagination,
    setPagination,

    permissions,

    handleView,
    handleEdit,

    handleDeleteClick,

    handleAddNewClick,
    handleBulkDelete,

    confirmDelete,
    cancelDelete,
  };
};

export default useMenuDetails;
