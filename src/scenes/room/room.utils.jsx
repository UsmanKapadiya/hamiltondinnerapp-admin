import { Box, Typography, Button } from "@mui/material";

export const getColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  permissions,
}) => [
  {
    field: "room_name",
    headerName: "Unit Number",
  },

  {
    field: "resident_name",
    headerName: "Resident Name",
    flex: 1,
  },

  {
    field: "occupancy",
    headerName: "Occupancy",
    type: "number",
    headerAlign: "left",
    align: "left",
  },

  {
    field: "language",
    headerName: "Language Preference",
    // flex: 1,

    renderCell: ({ value }) => (
      <Typography>
        {value === "0" || value === 0 ? "English" : "Chinese"}
      </Typography>
    ),
  },

  {
    field: "is_active",
    headerName: "Status",
    flex: 1,

    renderCell: ({ row: { is_active } }) => (
      <Typography textTransform="capitalize">
        {is_active === 1 ? "Active" : "Inactive"}
      </Typography>
    ),
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
          disabled={!permissions.canView}
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
          disabled={!permissions.canDelete}
        >
          Delete
        </Button>
      </Box>
    ),
  },
];
