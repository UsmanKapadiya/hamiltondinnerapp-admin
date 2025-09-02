import { Box, Typography, useTheme, Button, InputBase, IconButton } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataCategories, type } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  Close,
  DvrOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const Category = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [searchText, setSearchText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categoryListData, setCategoryListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permissions (memoized)
  const canAdd = useMemo(() => hasPermission(permissionList, "add_CategoryDetails"), [permissionList]);
  const canView = useMemo(() => hasPermission(permissionList, "read_CategoryDetails"), [permissionList]);
  const canEdit = useMemo(() => hasPermission(permissionList, "edit_CategoryDetails"), [permissionList]);
  const canDelete = useMemo(() => hasPermission(permissionList, "delete_CategoryDetails"), [permissionList]);
  const canBrowse = useMemo(() => hasPermission(permissionList, "browse_Category"), [permissionList]);

  // Fetch category list
  const getCategoryListData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoryServices.getCategoryList();
      setCategoryListData(response?.data || []);
    } catch (error) {
      console.error("Error fetching Course list:", error);
      toast.error("Failed to fetch Course list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategoryListData();
  }, [getCategoryListData]);

  // Handlers (memoized)
  const handleDelete = useCallback((data) => {
    setSelectedIds([]);
    setSelectedId(data?.id);
    setSelectedCategoryName(data?.cat_name);
    setDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    selectedIds.length > 0 && !selectedCategoryName
      ? bulkDeleteCategory(selectedIds)
      : deleteCategory(selectedId);
    setDialogOpen(false);
  }, [selectedIds, selectedCategoryName, selectedId]);

  const cancelDelete = useCallback(() => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedCategoryName("");
  }, []);

  const handleView = useCallback((id) => {
    navigate(`/category-details/${id}`, { state: { id, categoryListData } });
  }, [navigate, categoryListData]);

  const handleEdit = useCallback((id) => {
    const selectedRow = categoryListData.find((row) => row.id === id);
    navigate(`/category-details/${id}/edit`, { state: { selectedCategory: selectedRow, categoryListData } });
  }, [navigate, categoryListData]);

  const handleAddNewClick = useCallback(() => {
    navigate("/category-details/create", { state: { categoryListData } });
  }, [navigate, categoryListData]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one Course to delete.");
    }
  }, [selectedIds]);

  const handleOrderClick = useCallback(() => {
    navigate("/category-details/order");
  }, [navigate]);

  const handleRowSelection = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  // Delete functions
  const bulkDeleteCategory = useCallback(async (ids) => {
    try {
      setLoading(true);
      await CategoryServices.bulkdeleteCategorys(JSON.stringify({ ids }));
      toast.success("Multiple categories deleted successfully!");
      getCategoryListData();
    } catch (error) {
      console.error("Error deleting categories:", error);
      toast.error("Failed to delete categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCategoryListData]);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(true);
      await CategoryServices.deleteCategorys(id);
      toast.success("Course deleted successfully!");
      getCategoryListData();
      setSelectedCategoryName("");
    } catch (error) {
      console.error("Error deleting Course:", error);
      toast.error("Failed to delete Course. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCategoryListData]);

  // Columns (memoized)
  const columns = useMemo(() => [
    { field: "cat_name", headerName: "Course Name", flex: 1 },
    {
      field: "category_chinese_name",
      headerName: "Course Chinese Name",
      flex: 1,
    },
    {
      field: "categoryType",
      headerName: "Meal Type",
      valueGetter: (params) => {
        const typeId = params.row.type;
        const typeObj = type.find((t) => t.id === JSON.parse(typeId));
        return typeObj ? typeObj.type_name : "N/A";
      },
    },
    {
      field: "parentId",
      headerName: "Parent Course",
      valueGetter: (params) => {
        const parentId = params.row.parent_id;
        const parentObj = categoryListData.find((t) => t.id === JSON.parse(parentId));
        return parentObj ? parentObj.cat_name : "";
      },
      flex: 1,
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
  ], [canView, canEdit, canDelete, categoryListData, handleView, handleEdit, handleDelete]);

  // Filtered rows (memoized)
  const filteredRows = useMemo(() => {
    const search = searchText.toLowerCase();
    return categoryListData.filter(
      (row) =>
        row.cat_name?.toLowerCase().includes(search) ||
        row.category_chinese_name?.toLowerCase().includes(search)
    );
  }, [categoryListData, searchText]);

  return (
    <Box m="20px">
      <Header
        title="Course Details"
        icon={<DvrOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        buttons={true}
        addButton={canAdd && canBrowse}
        deleteButton={canDelete && canBrowse}
      />
      {canBrowse ? (
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
              placeholder="Search by Course Name or Course Chinese Name..."
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
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            checkboxSelection
            onRowSelectionModelChange={handleRowSelection}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedCategoryName
                ? `Are you sure you want to delete ${selectedIds.length} Course items?`
                : `Are you sure you want to delete the Course "${selectedCategoryName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Course Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default Category;