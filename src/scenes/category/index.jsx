import { Box, Typography, useTheme, Button } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataCategories, type } from "../../data/mockData";
import { tokens } from "../../theme";
import {
  AdminPanelSettingsOutlined,
  DvrOutlined,
  Home,
  SecurityOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import CategoryServices from "../../services/categoryServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [categoryListData, setCategoryListData] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryListData()
  }, [])


  const getCategoryListData = async () => {
    try {
      setLoading(true);
      const response = await CategoryServices.getCategoryList();
      // console.log(" getCategoryListData response", response)
      setCategoryListData(response?.data)

    } catch (error) {
      console.error("Error fetching menu list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (data) => {
    setSelectedIds([])
    setSelectedId(data?.id);
    setSelectedCategoryName(data?.cat_name);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    selectedIds.length > 0 && !selectedCategoryName
      ? bulkDeleteCategory(selectedIds) : deleteCategory(selectedId);
    setDialogOpen(false);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSelectedCategoryName("")
  };

  const handleView = (id) => {
    navigate(`/category-details/${id}`, { state: { id, categoryListData: categoryListData } });
  };

  const handleEdit = (id) => {
    console.log(id)
    const selectedRow = categoryListData.find((row) => row.id === id);
    navigate(`/category-details/${id}/edit`, { state: { selectedCategory: selectedRow, categoryListData: categoryListData } });;
  };
  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/category-details/create", { state: { categoryListData: categoryListData } });
  };
  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setDialogOpen(true);
    } else {
      toast.warning("Please select at least one category to delete.");
    }
  };
  const handleOrderClick = () => {
    navigate("/category-details/order");
  };
  const handleRowSelection = (ids) => {
    setSelectedIds(ids);
  };


  const bulkDeleteCategory = async (ids) => {
    try {
      let data = JSON.stringify({
        "ids": ids
      });
      const response = await CategoryServices.bulkdeleteCategorys(data);
      // console.log(response)
      setLoading(true)
      toast.success("Multiple Category Deleted successfully!");
      getCategoryListData();
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteCategory = async (id) => {
    try {
      const response = await CategoryServices.deleteCategorys(id);
      console.log(response)
      setLoading(true)
      toast.success("Category Deleted successfully!");
      getCategoryListData();
      setSelectedCategoryName("")
    } catch (error) {
      console.error("Error fetching menu list:", error);
      toast.error("Failed to process menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAdd = hasPermission(permissionList, "add_CategoryDetails");
  const canView = hasPermission(permissionList, "read_CategoryDetails");
  const canEdit = hasPermission(permissionList, "edit_CategoryDetails");
  const canDelete = hasPermission(permissionList, "delete_CategoryDetails");
  const canBrowse = hasPermission(permissionList, "browse_Category");

  const columns = [
    { field: "cat_name", headerName: "Category Name", flex: 1 },
    {
      field: "category_chinese_name",
      headerName: "Category Chinese Name",
      flex: 1,
      // cellClassName: "name-column--cell",
    },
    {
      field: "categoryType", headerName: "Category Type",
      valueGetter: (params) => {
        const typeId = params.row.type;
        const typeObj = type.find((t) => t.id === typeId);
        return typeObj ? typeObj.type_name : "N/A";
      },
    },
    {
      field: "parentId",
      headerName: "Parent Id",
      valueGetter: (params) => {
        const parentId = params.row.parent_id;
        const parentObj = categoryListData.find((t) => t.id === parentId);
        return parentObj ? parentObj.cat_name : "No results";
      },
      flex: 1,
    },
    // {
    //   field: "active",
    //   headerName: "Active",
    //   flex: 1,
    //   renderCell: ({ row: { active } }) => {
    //     return (
    //       <Box
    //         width="120px"
    //         p={1}
    //         display="flex"
    //         alignItems="center"
    //         justifyContent="center"
    //         gap={1}
    //         bgcolor={
    //           active === true
    //             ? colors.greenAccent[600]
    //             : colors.greenAccent[700]
    //         }
    //         borderRadius={1}
    //       >
    //         {active === true && <AdminPanelSettingsOutlined />}
    //         {active === false && <SecurityOutlined />}
    //         <Typography textTransform="capitalize">
    //           {active === true ? "active" : "Inactive"}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
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
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Category Details"
        icon={<DvrOutlined />}
        addNewClick={handleAddNewClick}
        addBulkDelete={handleBulkDelete}
        orderClick={handleOrderClick}
        showToggleClick={handleToggle}
        addButton={canAdd && canBrowse}
        deleteButton={canDelete && canBrowse}
      />
      {canBrowse ? (
        <Box
          mt="40px"
          height="75vh"
          flex={1}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
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
          <DataGrid
            rows={categoryListData}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            checkboxSelection
            onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
            }}
          />
          <ConfirmationDialog
            open={dialogOpen}
            title="Confirm Delete"
            message={
              selectedIds.length > 0 && !selectedCategoryName
                ? `Are you sure you want to delete ${selectedIds.length} Category items?`
                : `Are you sure you want to delete the Category "${selectedCategoryName}"?`
            }
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Category Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default Category;

