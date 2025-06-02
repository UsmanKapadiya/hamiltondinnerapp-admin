import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { ListAltOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockDataCategories } from "../../data/mockData";

const SortableItem = ({ id, content, color }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color,
    marginBottom: "10px",
    padding: "10px",
    cursor: "pointer",
    // transition: "0.3s ease",
  };


  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography variant="h5" fontWeight="600">
        {content}
      </Typography>
    </Box>
  );
};

const CategoryDetailsOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");

  const [records, setRecords] = useState(
    mockDataCategories.map((category) => ({
      id: category.id,
      content: category.categoryName,
    }))
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = records.findIndex((r) => r.id === active.id);
    const newIndex = records.findIndex((r) => r.id === over.id);

    setRecords((items) => arrayMove(items, oldIndex, newIndex));
  };

  return (
    <Box m="20px">
      <Header
        title="Room Details Order"
        icon={<ListAltOutlined />}
        Buttons={false}
      />
      <Box
        gridColumn={isXlDevices ? "span 4" : "span 3"}
        gridRow="span 2"
        bgcolor={colors.primary[400]}
        overflow="auto"
      >
        <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
          <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
            Drag and drop the Items below to re-arrange them.
          </Typography>
        </Box>


        <Box p="15px">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={records.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {records.map((record) => (
                <SortableItem
                  key={record.id}
                  id={record.id}
                  content={record.content}
                  color={colors.gray[400]}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryDetailsOrder;
