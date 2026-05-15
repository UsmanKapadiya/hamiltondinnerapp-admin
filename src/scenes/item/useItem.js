import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import ItemServices from "../../services/itemServices";

import CategoryServices from "../../services/categoryServices";

import { hasPermission } from "../../components/permissions";

const useItem = () => {
  const navigate = useNavigate();

  const permissionList = useSelector(
    (state) =>
      state?.permissionState?.permissionsList
  );

  const userData = JSON.parse(
    localStorage.getItem("userData")
  );

  const [searchText, setSearchText] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [selectedItemName, setSelectedItemName] =
    useState("");

  const [itemListData, setItemListData] =
    useState([]);

  const [categoryListData, setCategoryListData] =
    useState([]);

  const [optionsListData, setOptionsListData] =
    useState([]);

  const [
    preferencesListData,
    setPreferencesListData,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      page: 1,
      pageSize: 10,
      total: 0,
    });

  // permissions

  const permissions = useMemo(() => {
    const base = {
      canAdd: hasPermission(
        permissionList,
        "add_ItemDetails"
      ),

      canView: hasPermission(
        permissionList,
        "read_ItemDetails"
      ),

      canEdit: hasPermission(
        permissionList,
        "edit_ItemDetails"
      ),

      canDelete: hasPermission(
        permissionList,
        "delete_ItemDetails"
      ),

      canBrowse: hasPermission(
        permissionList,
        "browse_Item"
      ),

      isSuperAdmin:
        userData?.role === "superadmin",
    };

    return {
      ...base,

      canShowAdd:
        (base.canAdd && base.canBrowse) ||
        base.isSuperAdmin,

      canShowDelete:
        (base.canDelete &&
          base.canBrowse) ||
        base.isSuperAdmin,
    };
  }, [permissionList, userData]);

  // fetch items

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const [
        itemRes,
        catRes,
        optRes,
        prefRes,
      ] = await Promise.all([
        ItemServices.getItemList(),

        CategoryServices.getCategoryList(),

        ItemServices.getOptionList(),

        ItemServices.getPreferencesList(),
      ]);

      setItemListData(itemRes.data);

      setPagination((prev) => ({
        ...prev,
        total: itemRes.count,
      }));

      setCategoryListData(catRes?.data || []);

      setOptionsListData(optRes.data || []);

      setPreferencesListData(
        prefRes.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch menu item list."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // handlers

  const handleView = useCallback(
    (id) => {
      navigate(`/menu-item-details/${id}`, {
        state: {
          id,
          categoryListData,
          optionsList:
            optionsListData,
          preferencesList:
            preferencesListData,
        },
      });
    },
    [
      navigate,
      categoryListData,
      optionsListData,
      preferencesListData,
    ]
  );

  const handleEdit = useCallback(
    (id) => {
      const selectedRow =
        itemListData.find(
          (row) => row.id === id
        );

      navigate(
        `/menu-item-details/${id}/edit`,
        {
          state: {
            selectedRow,
            categoryListData,
            optionsList:
              optionsListData,
            preferencesList:
              preferencesListData,
          },
        }
      );
    },
    [
      navigate,
      itemListData,
      categoryListData,
      optionsListData,
      preferencesListData,
    ]
  );

  const handleAdd = () => {
    navigate("/menu-item-details/create", {
      state: {
        categoryListData,
        optionsList: optionsListData,
        preferencesList:
          preferencesListData,
      },
    });
  };

  const handleOrderClick = () => {
    navigate("/menu-item-details/order");
  };

  const handleDeleteClick = (row) => {
    setSelectedIds([]);

    setSelectedId(row.id);

    setSelectedItemName(row.item_name);

    setDialogOpen(true);
  };

  // single delete

  const deleteSingle = async (id) => {
    try {
      setLoading(true);

      await ItemServices.deleteItems(id);

      toast.success(
        "Menu Item Deleted Successfully"
      );

      fetchItems();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete menu item."
      );
    } finally {
      setLoading(false);
    }
  };

  // bulk delete

  const deleteBulk = async (ids) => {
    try {
      setLoading(true);

      await ItemServices.bulkdeleteItems(
        JSON.stringify({ ids })
      );

      toast.success(
        "Menu Items Deleted Successfully"
      );

      fetchItems();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete menu items."
      );
    } finally {
      setLoading(false);
    }
  };

  // confirm delete

  const confirmDelete = () => {
    const isBulk =
      selectedIds.length > 0 &&
      !selectedItemName;

    isBulk
      ? deleteBulk(selectedIds)
      : deleteSingle(selectedId);

    setDialogOpen(false);
  };

  // cancel delete

  const cancelDelete = () => {
    setDialogOpen(false);

    setSelectedId(null);

    setSelectedItemName("");
  };

  // bulk delete click

  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      toast.warning(
        "Please select at least one Menu Item."
      );

      return;
    }

    setDialogOpen(true);
  };

  // filtered rows

  const filteredRows = useMemo(() => {
    return itemListData.filter(
      (row) =>
        row.item_name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          ) ||
        row.item_chinese_name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
    );
  }, [itemListData, searchText]);

  return {
    searchText,
    setSearchText,

    dialogOpen,

    selectedItemName,

    selectedIds,
    setSelectedIds,

    loading,

    filteredRows,

    pagination,
    setPagination,

    permissions,

    categoryListData,

    handleView,
    handleEdit,
    handleAdd,

    handleDeleteClick,

    handleBulkDelete,

    handleOrderClick,

    confirmDelete,
    cancelDelete,
  };
};

export default useItem;
