import { Box } from "@mui/material";
import _ from "lodash";

const ItemsGrid = ({ items, selectedItems, onSelectItem, colors }) => {
  return (
    <Box
      display="grid"
      gap="20px"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
      bgcolor={colors.primary[400]}
      p="20px"
      borderRadius="8px"
      sx={{
        gridColumn: { xs: "span 1", sm: "span 6" },
      }}
      height={350}
      overflow="auto"
    >
      {_.map(items, (item) => (
        <Box
          key={item.id}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={_.includes(selectedItems, item.id) ? colors.gray[800] : "transparent"}
          p="10px"
          borderRadius="8px"
          sx={{
            cursor: "pointer",
            transition: "background-color 0.3s",
            height: "fit-content",
            minHeight: "100px",
            border: "1px solid",
          }}
          onClick={() => onSelectItem(item)}
        >
          {item.item_name}
        </Box>
      ))}
    </Box>
  );
};

export default ItemsGrid;
