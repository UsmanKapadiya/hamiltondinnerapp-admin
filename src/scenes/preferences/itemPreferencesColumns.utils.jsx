import {
  Box,
  Button,
} from "@mui/material";

const itemPreferencesColumns = ({
  handleView,
  handleEdit,
  handleDelete,
  canView,
  canEdit,
  canDelete,
}) => [
  {
    field: "pname",
    headerName:
      "Preference Name",
    flex: 1,
  },

  {
    field: "pname_cn",
    headerName:
      "Preference Chinese Name",
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

export default itemPreferencesColumns;
