import {
  Box,
  TextField,
  Typography,
} from "@mui/material";

const MenuSection = ({
  colors,
  categories,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  items,
  selectedItems,
  onSelectItem,
}) => {
  return (
    <>
      <Box mt="15px">
        <TextField
          fullWidth
          variant="outlined"
          label="Search Menu Item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Box
        display="grid"
        gap="20px"
        mt="15px"
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(8, 1fr)",
          },
        }}
      >
        {/* LEFT CATEGORY */}

        <Box
          bgcolor={colors.primary[400]}
          p="20px"
          borderRadius="8px"
          sx={{
            gridColumn: {
              xs: "span 1",
              sm: "span 2",
            },
          }}
        >
          {categories.map((category) => (
            <Box
              key={category.id}
              onClick={() =>
                setSelectedCategory(category.cat_name)
              }
              sx={{
                cursor: "pointer",
                bgcolor:
                  selectedCategory === category.cat_name
                    ? colors.gray[800]
                    : "transparent",
                p: "10px",
                borderRadius: "8px",
              }}
            >
              <Typography>
                {category.cat_name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* RIGHT ITEMS */}

        <Box
          display="grid"
          gap="20px"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(3,1fr)",
          }}
          bgcolor={colors.primary[400]}
          p="20px"
          borderRadius="8px"
          sx={{
            gridColumn: {
              xs: "span 1",
              sm: "span 6",
            },
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              bgcolor={
                selectedItems.includes(item.id)
                  ? colors.gray[800]
                  : "transparent"
              }
              sx={{
                cursor: "pointer",
                border: "1px solid",
                minHeight: "100px",
              }}
            >
              {item.item_name}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MenuSection;
