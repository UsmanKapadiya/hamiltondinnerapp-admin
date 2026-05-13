import { Box, Typography } from "@mui/material";
import _ from "lodash";

const CategoryList = ({ categories, selectedCategory, onSelectCategory, colors }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={colors.primary[400]}
      p="20px"
      borderRadius="8px"
      sx={{
        gridColumn: { xs: "span 1", sm: "span 2" },
        mb: { xs: 2, sm: 0 },
      }}
      height={350}
    >
      <Box p="15px">
        {_.map(categories, (category) => (
          <Box
            key={category.id}
            onClick={() => onSelectCategory(category.cat_name)}
            sx={{
              cursor: "pointer",
              bgcolor: selectedCategory === category.cat_name ? colors.gray[800] : "transparent",
              p: "10px",
              borderRadius: "8px",
              transition: "background-color 0.3s",
            }}
          >
            <Typography variant="h5" fontWeight="600" color={colors.primary[100]}>
              {category.cat_name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryList;
