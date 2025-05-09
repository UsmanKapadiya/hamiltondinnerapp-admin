import {
  Box, useTheme, Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import {LocalPizzaOutlined,} from "@mui/icons-material";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const mealCategories = {
    breakfast: [
      { code: 'BA', name: 'Western Omelette, Oatmeal & Fruits' },
      { code: 'B1', name: 'Egg Choice' },
      { code: 'B2', name: 'Toast' },
      { code: 'B3', name: 'Oat' },
      { code: 'B4', name: 'Fruit' },
    ],
    lunch: [
      { code: 'LS', name: 'Soup of the Day' },
      { code: 'LA', name: 'Chicken/Beans' },
      { code: 'LB', name: 'Tuna Sandwich' },
      { code: 'L1', name: 'Egg Sandwich' },
      { code: 'L2', name: 'Ham Sandwich' },
      { code: 'L3', name: 'Turkey Sandwich' },
      { code: 'L4', name: 'Cheese Omelette' },
    ],
    dinner: [
      { code: 'DA', name: 'Salt Baked Chicken' },
      { code: 'DB', name: 'Seafood Pasta' },
      { code: 'D1', name: 'Chicken Breast' },
      { code: 'D2', name: 'Fish' },
      { code: 'D3', name: 'Veg Plate' },
      { code: 'D4', name: 'Sandwich of the Day' },
    ],
  };
  // const roomData = []
  // Sample data for rooms
  const roomData = [
    {
      roomNo: '101',
      selections: {
        BA: 1, B1: 1, B2: 0, B3: 0, B4: 1,
        LS: 1, LA: 0, LB: 0, L1: 1, L2: 0, L3: 0, L4: 0,
        DA: 0, DB: 1, D1: 1, D2: 0, D3: 0, D4: 1,
      },
    },
    {
      roomNo: '102',
      selections: {
        BA: 0, B1: 0, B2: 0, B3: 1, B4: 0,
        LS: 0, LA: 1, LB: 0, L1: 0, L2: 1, L3: 0, L4: 0,
        DA: 1, DB: 0, D1: 0, D2: 1, D3: 1, D4: 0,
      },
    },
  ];

  const allCodes = [
    ...mealCategories.breakfast,
    ...mealCategories.lunch,
    ...mealCategories.dinner,
  ];



  return (
    <Box m="20px">
      <Header
        title="Order Details"
        icon={<LocalPizzaOutlined />}
        Buttons={false}
      />
      <Box
        mt="40px"
        height="75vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow sx={{backgroundColor:colors.blueAccent[700]}}>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                >
                  Room No
                </TableCell>
                <TableCell
                  colSpan={mealCategories.breakfast.length}
                  align="center"
                  sx={{border: '1px solid rgba(224, 224, 224, 1)' }}
                >
                  Breakfast
                </TableCell>
                <TableCell
                  colSpan={mealCategories.lunch.length}
                  align="center"
                  sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                >
                  Lunch
                </TableCell>
                <TableCell
                  colSpan={mealCategories.dinner.length}
                  align="center"
                  sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                >
                  Dinner
                </TableCell>
              </TableRow>
              <TableRow sx={{backgroundColor:colors.blueAccent[700]}}>
                {allCodes.map((item) => (
                  <TableCell
                    key={item.code}
                    align="center"
                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                  >
                    {item.code}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roomData.map((room, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                  >
                    {room.roomNo}
                  </TableCell>
                  {allCodes.map((item) => (
                    <TableCell
                      key={item.code}
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      {room.selections[item.code]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default OrderDetails;

