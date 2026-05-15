import { Box, Button } from "@mui/material";

const itemOptionsColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  canView,
  canEdit,
  canDelete,
}) => [
  {
    field: "option_name",
    headerName: "Option Name",
    flex: 1,
  },

  {
    field: "option_name_cn",
    headerName: "Option Chinese Name",
    flex: 1,
  },

  {
    field: "is_paid_item",
    headerName: "Is Paid Item",

    renderCell: (params) =>
      params.value ? "Yes" : "No",
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
          disabled={!canView}
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
          disabled={!canEdit}
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
          disabled={!canDelete}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];

export default itemOptionsColumns;
