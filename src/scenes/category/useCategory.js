import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryServices from "../../services/categoryServices";
import { hasPermission } from "../../components/permissions";
import getCategoryColumns from "./category.utils";


const useCategory = (permissionList) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [categoryListData, setCategoryListData] = useState([]);
    const [loading, setLoading] = useState(true);

    const canAdd = hasPermission(
        permissionList,
        "add_CategoryDetails"
    );

    const canView = hasPermission(
        permissionList,
        "read_CategoryDetails"
    );

    const canEdit = hasPermission(
        permissionList,
        "edit_CategoryDetails"
    );

    const canDelete = hasPermission(
        permissionList,
        "delete_CategoryDetails"
    );

    const canBrowse = hasPermission(
        permissionList,
        "browse_Category"
    );

    const getCategoryListData =
        useCallback(async () => {
            try {
                setLoading(true);

                const response =
                    await CategoryServices.getCategoryList();

                setCategoryListData(
                    response?.data || []
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    "Failed to fetch Course list."
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        getCategoryListData();
    }, [getCategoryListData]);

    const handleDelete = useCallback(
        (data) => {
            setSelectedIds([]);

            setSelectedId(data?.id);

            setSelectedCategoryName(
                data?.cat_name
            );

            setDialogOpen(true);
        },
        []
    );

    const deleteCategory =
        useCallback(
            async (id) => {
                try {
                    setLoading(true);

                    await CategoryServices.deleteCategorys(
                        id
                    );

                    toast.success(
                        "Course deleted successfully!"
                    );

                    getCategoryListData();

                    setSelectedCategoryName(
                        ""
                    );
                } catch (error) {
                    console.error(error);

                    toast.error(
                        "Failed to delete Course."
                    );
                } finally {
                    setLoading(false);
                }
            },
            [getCategoryListData]
        );

    const bulkDeleteCategory =
        useCallback(
            async (ids) => {
                try {
                    setLoading(true);

                    await CategoryServices.bulkdeleteCategorys(
                        JSON.stringify({ ids })
                    );

                    toast.success(
                        "Multiple categories deleted successfully!"
                    );

                    getCategoryListData();
                } catch (error) {
                    console.error(error);

                    toast.error(
                        "Failed to delete categories."
                    );
                } finally {
                    setLoading(false);
                }
            },
            [getCategoryListData]
        );

    const confirmDelete =
        useCallback(() => {
            selectedIds.length > 0 &&
                !selectedCategoryName
                ? bulkDeleteCategory(
                    selectedIds
                )
                : deleteCategory(selectedId);

            setDialogOpen(false);
        }, [
            selectedIds,
            selectedCategoryName,
            selectedId,
            bulkDeleteCategory,
            deleteCategory,
        ]);

    const cancelDelete =
        useCallback(() => {
            setDialogOpen(false);

            setSelectedId(null);

            setSelectedCategoryName("");
        }, []);

    const handleView = useCallback(
        (id) => {
            navigate(
                `/category-details/${id}`,
                {
                    state: {
                        id,
                        categoryListData,
                    },
                }
            );
        },
        [navigate, categoryListData]
    );

    const handleEdit = useCallback(
        (id) => {
            const selectedRow =
                categoryListData.find(
                    (row) => row.id === id
                );

            navigate(
                `/category-details/${id}/edit`,
                {
                    state: {
                        selectedCategory:
                            selectedRow,
                        categoryListData,
                    },
                }
            );
        },
        [navigate, categoryListData]
    );

    const handleAddNewClick =
        useCallback(() => {
            navigate(
                "/category-details/create",
                {
                    state: {
                        categoryListData,
                    },
                }
            );
        }, [navigate, categoryListData]);

    const handleBulkDelete =
        useCallback(() => {
            if (selectedIds.length > 0) {
                setDialogOpen(true);
            } else {
                toast.warning(
                    "Please select at least one Course to delete."
                );
            }
        }, [selectedIds]);

    const handleOrderClick =
        useCallback(() => {
            navigate(
                "/category-details/order"
            );
        }, [navigate]);

    const handleRowSelection =
        useCallback((ids) => {
            setSelectedIds(ids);
        }, []);

    const columns = useMemo(
        () =>
            getCategoryColumns({
                categoryListData,
                handleView,
                handleEdit,
                handleDelete,
                canView,
                canEdit,
                canDelete,
            }),
        [
            categoryListData,
            handleView,
            handleEdit,
            handleDelete,
            canView,
            canEdit,
            canDelete,
        ]
    );

    const filterCategories = (
        categoryListData,
        searchText
    ) => {
        const search = searchText.toLowerCase();

        return categoryListData.filter(
            (row) =>
                row.cat_name
                    ?.toLowerCase()
                    .includes(search) ||
                row.category_chinese_name
                    ?.toLowerCase()
                    .includes(search)
        );
    };

    const filteredRows = useMemo(
        () =>
            filterCategories(
                categoryListData,
                searchText
            ),
        [categoryListData, searchText]
    );

    return {
        searchText,
        setSearchText,
        dialogOpen,
        selectedIds,
        selectedCategoryName,
        loading,
        filteredRows,
        columns,
        canAdd,
        canDelete,
        canBrowse,
        handleAddNewClick,
        handleBulkDelete,
        handleOrderClick,
        handleRowSelection,
        confirmDelete,
        cancelDelete,
    };
};

export default useCategory;