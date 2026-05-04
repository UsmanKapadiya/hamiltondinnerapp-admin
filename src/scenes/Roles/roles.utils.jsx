import { Box, Button } from "@mui/material";

export const getColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  permissions,
}) => [
  { field: "name", headerName: "Name", flex: 1 },

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
          disabled={!permissions.canView && !permissions.isSuperAdmin}
        >
          View
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(row.id)}
          disabled={!permissions.canEdit && !permissions.isSuperAdmin}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(row)}
          disabled={!permissions.canDelete && !permissions.isSuperAdmin}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];
