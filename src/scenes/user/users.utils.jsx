import { Box, Button } from "@mui/material";

export const getColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  permissions,
}) => [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "user_name", headerName: "User Name" },
  { field: "email", headerName: "Email", flex: 1 },

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
          disabled={!permissions.canView }
        >
          View
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(row.id)}
          disabled={!permissions.canEdit}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(row)}
          disabled={!permissions.canDelete }
        >
          Delete
        </Button>
      </Box>
    ),
  },
];