import { Box, Button } from "@mui/material";

export const getColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  permissions,
  categoryListData,
}) => [
  {
    field: "item_name",
    headerName: "Menu Item Name",
    flex: 1,
  },

  {
    field: "item_chinese_name",
    headerName:
      "Menu Item Chinese Name",
    flex: 1,
  },

  {
    field: "category",
    headerName: "Course",
    flex: 1,

    valueGetter: (params) => {
      const category =
        categoryListData.find(
          (cat) => cat.id === params.row.cat_id
        );

      return category?.cat_name || "N/A";
    },
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
          onClick={() =>
            handleView(row.id)
          }
          disabled={!permissions.canView}
        >
          View
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            handleEdit(row.id)
          }
          disabled={!permissions.canEdit}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() =>
            handleDelete(row)
          }
          disabled={
            !permissions.canDelete
          }
        >
          Delete
        </Button>
      </Box>
    ),
  },
];