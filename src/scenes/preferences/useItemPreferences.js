import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ItemServices from "../../services/itemServices";
import { hasPermission } from "../../components/permissions";
import useDebounce from "../../utils/useDebounce";
import itemPreferencesColumns from "./itemPreferencesColumns.utils";
const useItemPreferences = (permissionList) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] =
        useState("");

    const debouncedSearch =
        useDebounce(searchText, 300);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedId, setSelectedId] =
        useState(null);

    const [selectedIds, setSelectedIds] =
        useState([]);

    const [
        selectedPreferenceName,
        setSelectedPreferenceName,
    ] = useState("");

    const [
        preferencesListData,
        setPreferencesListData,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [pagination, setPagination] =
        useState({
            page: 1,
            pageSize: 10,
            total: 0,
        });

    const fetchALLPreferenceList =
        useCallback(async () => {
            setLoading(true);

            try {
                const response =
                    await ItemServices.getPreferencesList(
                        {
                            page: pagination.page,

                            pageSize:
                                pagination.pageSize,

                            search:
                                debouncedSearch,
                        }
                    );

                setPreferencesListData(
                    response.data
                );

                setPagination((prev) => ({
                    ...prev,

                    total: response.count,
                }));
            } catch (error) {
                console.error(
                    "Error fetching menu list:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }, [
            pagination.page,
            pagination.pageSize,
            debouncedSearch,
        ]);

    useEffect(() => {
        fetchALLPreferenceList();
    }, [fetchALLPreferenceList]);

    const handleRowSelection =
        useCallback((ids) => {
            setSelectedIds(ids);
        }, []);

    const handleDelete = useCallback(
        (data) => {
            setSelectedIds([]);

            setSelectedId(data?.id);

            setSelectedPreferenceName(
                data?.pname
            );

            setDialogOpen(true);
        },
        []
    );

    const bulkDeletePreference =
        useCallback(
            async (ids) => {
                try {
                    let data = JSON.stringify({
                        ids,
                    });

                    await ItemServices.bulkdeletePreferences(
                        data
                    );

                    setLoading(true);

                    toast.success(
                        "Multiple Preferences Deleted successfully!"
                    );

                    fetchALLPreferenceList();
                } catch (error) {
                    console.error(
                        "Error deleting preferences:",
                        error
                    );

                    toast.error(
                        "Failed to process preference. Please try again."
                    );
                } finally {
                    setLoading(false);
                }
            },
            [fetchALLPreferenceList]
        );

    const deletePreference =
        useCallback(
            async (id) => {
                try {
                    setLoading(true);

                    await ItemServices.deletePreferences(
                        id
                    );

                    toast.success(
                        "Preference Deleted successfully!"
                    );

                    fetchALLPreferenceList();

                    setSelectedPreferenceName(
                        ""
                    );
                } catch (error) {
                    console.error(
                        "Error deleting preference:",
                        error
                    );

                    toast.error(
                        "Failed to process Preference. Please try again."
                    );
                } finally {
                    setLoading(false);
                }
            },
            [fetchALLPreferenceList]
        );

    const confirmDelete =
        useCallback(() => {
            selectedIds.length > 0 &&
                !selectedPreferenceName
                ? bulkDeletePreference(
                    selectedIds
                )
                : deletePreference(
                    selectedId
                );

            setDialogOpen(false);
        }, [
            selectedIds,
            selectedPreferenceName,
            selectedId,
            bulkDeletePreference,
            deletePreference,
        ]);

    const cancelDelete =
        useCallback(() => {
            setDialogOpen(false);

            setSelectedId(null);

            setSelectedPreferenceName(
                ""
            );
        }, []);

    const handleView = useCallback(
        (id) => {
            navigate(
                `/menu-item-preferences/${id}`,
                {
                    state: { id },
                }
            );
        },
        [navigate]
    );

    const handleEdit = useCallback(
        (id) => {
            const selectedRow =
                preferencesListData.find(
                    (row) => row.id === id
                );

            navigate(
                `/menu-item-preferences/${id}/edit`,
                {
                    state: selectedRow,
                }
            );
        },
        [navigate, preferencesListData]
    );

    const handleAddNewClick =
        useCallback(() => {
            navigate(
                "/menu-item-preferences/create"
            );
        }, [navigate]);

    const handleBulkDelete =
        useCallback(() => {
            if (selectedIds.length > 0) {
                setDialogOpen(true);
            } else {
                toast.warning(
                    "Please select at least one Preferences to delete."
                );
            }
        }, [selectedIds]);

    const handlePaginationChange =
        useCallback(
            (newPaginationModel) => {
                setPagination((prev) => ({
                    ...prev,

                    page:
                        newPaginationModel.page +
                        1,

                    pageSize:
                        newPaginationModel.pageSize,
                }));
            },
            []
        );

    const canAdd = hasPermission(
        permissionList,
        "add_ItemPreference"
    );

    const canView = hasPermission(
        permissionList,
        "read_ItemPreference"
    );

    const canEdit = hasPermission(
        permissionList,
        "edit_ItemPreference"
    );

    const canDelete = hasPermission(
        permissionList,
        "delete_ItemPreference"
    );

    const canBrowse = hasPermission(
        permissionList,
        "browse_Preference"
    );

    const filteredRows = useMemo(() => {
        if (!debouncedSearch) {
            return preferencesListData;
        }

        return preferencesListData.filter(
            (row) =>
                row.pname
                    ?.toLowerCase()
                    .includes(
                        debouncedSearch.toLowerCase()
                    ) ||
                row.pname_cn
                    ?.toLowerCase()
                    .includes(
                        debouncedSearch.toLowerCase()
                    )
        );
    }, [
        preferencesListData,
        debouncedSearch,
    ]);

    const columns = useMemo(
        () =>
            itemPreferencesColumns({
                handleView,
                handleEdit,
                handleDelete,
                canView,
                canEdit,
                canDelete,
            }),

        [
            handleView,
            handleEdit,
            handleDelete,
            canView,
            canEdit,
            canDelete,
        ]
    );

    return {
        searchText,
        setSearchText,
        dialogOpen,
        selectedIds,
        selectedPreferenceName,
        loading,
        pagination,
        filteredRows,
        columns,
        canAdd,
        canDelete,
        canBrowse,
        handleAddNewClick,
        handleBulkDelete,
        handlePaginationChange,
        handleRowSelection,
        confirmDelete,
        cancelDelete,
    };
};

export default useItemPreferences;
