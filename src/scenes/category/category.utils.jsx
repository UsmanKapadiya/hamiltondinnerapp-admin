import React from "react";
import { Box, Button } from "@mui/material";
import { type } from "../../data/mockData";

const getCategoryColumns = ({
  categoryListData,
  handleView,
  handleEdit,
  handleDelete,
  canView,
  canEdit,
  canDelete,
}) => [
  {
    field: "cat_name",
    headerName: "Course Name",
    flex: 1,
  },

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

      const typeObj = type.find(
        (t) => t.id === JSON.parse(typeId)
      );

      return typeObj
        ? typeObj.type_name
        : "N/A";
    },
  },

  {
    field: "parentId",
    headerName: "Parent Course",
    flex: 1,

    valueGetter: (params) => {
      const parentId =
        params.row.parent_id;

      const parentObj =
        categoryListData.find(
          (t) =>
            t.id === JSON.parse(parentId)
        );

      return parentObj
        ? parentObj.cat_name
        : "";
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

export default getCategoryColumns;