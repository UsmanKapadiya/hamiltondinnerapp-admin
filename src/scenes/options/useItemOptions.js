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
import itemOptionsColumns from "./ItemOptions.utils";

const useItemOptions = (permissionList) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [optionsListData, setOptionsListData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] =
        useState({
            page: 1,
            pageSize: 10,
            total: 0,
        });

    const canAdd = hasPermission(
        permissionList,
        "add_ItemOptions"
    );

    const canView = hasPermission(
        permissionList,
        "read_ItemOptions"
    );

    const canEdit = hasPermission(
        permissionList,
        "edit_ItemOptions"
    );

    const canDelete = hasPermission(
        permissionList,
        "delete_ItemOptions"
    );

    const canBrowse = hasPermission(
        permissionList,
        "browse_Options"
    );

    const fetchALLOptionsList =
        useCallback(async () => {
            setLoading(true);

            try {
                const response =
                    await ItemServices.getOptionList();

                setOptionsListData(response.data);

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
        }, []);

    useEffect(() => {
        fetchALLOptionsList();
    }, [fetchALLOptionsList]);

    const handleRowSelection =
        useCallback((ids) => {
            setSelectedIds(ids);
        }, []);

    const handleDelete = useCallback(
        (data) => {
            setSelectedIds([]);

            setSelectedId(data?.id);

            setSelectedOptionName(
                data?.option_name
            );

            setDialogOpen(true);
        },
        []
    );

    const deleteOptions = useCallback(
        async (id) => {
            setLoading(true);

            try {
                await ItemServices.deleteOptions(id);

                toast.success(
                    "Options Deleted successfully!"
                );

                fetchALLOptionsList();

                setSelectedOptionName("");
            } catch (error) {
                console.error(
                    "Error deleting option:",
                    error
                );

                toast.error(
                    "Failed to process Option. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchALLOptionsList]
    );

    const bulkDeleteOptions =
        useCallback(
            async (ids) => {
                setLoading(true);

                try {
                    let data = JSON.stringify({
                        ids,
                    });

                    await ItemServices.bulkdeleteOptions(
                        data
                    );

                    toast.success(
                        "Multiple Options Deleted successfully!"
                    );

                    fetchALLOptionsList();
                } catch (error) {
                    console.error(
                        "Error deleting options:",
                        error
                    );

                    toast.error(
                        "Failed to process Option. Please try again."
                    );
                } finally {
                    setLoading(false);
                }
            },
            [fetchALLOptionsList]
        );

    const confirmDelete = useCallback(() => {
        selectedIds.length > 0 &&
            !selectedOptionName
            ? bulkDeleteOptions(selectedIds)
            : deleteOptions(selectedId);

        setDialogOpen(false);
    }, [
        selectedIds,
        selectedOptionName,
        selectedId,
        bulkDeleteOptions,
        deleteOptions,
    ]);

    const cancelDelete = useCallback(() => {
        setDialogOpen(false);

        setSelectedId(null);

        setSelectedOptionName("");
    }, []);

    const handleView = useCallback(
        (id) => {
            navigate(
                `/menu-item-options/${id}`,
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
                optionsListData.find(
                    (row) => row.id === id
                );

            navigate(
                `/menu-item-options/${id}/edit`,
                {
                    state: selectedRow,
                }
            );
        },
        [navigate, optionsListData]
    );

    const handleAddNewClick =
        useCallback(() => {
            navigate(
                "/menu-item-options/create"
            );
        }, [navigate]);

    const handleBulkDelete =
        useCallback(() => {
            if (selectedIds.length > 0) {
                setDialogOpen(true);
            } else {
                toast.warning(
                    "Please select at least one Option to delete."
                );
            }
        }, [selectedIds]);

    const handlePaginationChange =
        useCallback((newPaginationModel) => {
            setPagination((prev) => ({
                ...prev,
                page:
                    newPaginationModel.page + 1,
                pageSize:
                    newPaginationModel.pageSize,
            }));
        }, []);

    const columns = useMemo(
        () =>
            itemOptionsColumns({
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

    const filteredRows = useMemo(() => {
        const search =
            debouncedSearchText.toLowerCase();

        return optionsListData.filter(
            (row) =>
                row.option_name
                    ?.toLowerCase()
                    .includes(search) ||
                row.option_name_cn
                    ?.toLowerCase()
                    .includes(search)
        );
    }, [
        optionsListData,
        debouncedSearchText,
    ]);

    return {
        searchText,
        setSearchText,
        dialogOpen,
        selectedIds,
        selectedOptionName,
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

export default useItemOptions;