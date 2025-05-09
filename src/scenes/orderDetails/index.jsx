import {
  Box, useTheme, Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
  Menu,
  MenuItem

} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Header } from "../../components";
import { tokens } from "../../theme";
// import { } from "@mui/icons-material";
import { FileDownload, LocalPizzaOutlined, RestartAltOutlined, WidgetsOutlined, } from "@mui/icons-material";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReportServices from "../../services/reportServices";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState(dayjs("2025-03-15")); // Default date set to 2025-03-15
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [loading,setLoading]= useState(false)
  const [data, setData]=useState([])
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

  console.log(allCodes)


  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExportClick = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchor(null);
  };

  const handleExportOption = (option) => {
    console.log(`Exporting as ${option}`);
    handleExportClose();
  };
  
  useEffect(()=>{
    getReportsList()
  },[])

    const getReportsList = async () => {
      try {
        setLoading(true)
          const response = await ReportServices.getReportList(dayjs(date).format("YYYY-MM-DD"));
          setData(response)
      } catch (error) {
        console.error("Error fetching menu list:", error);
      } finally {
        setLoading(false);
      }
    };


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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {/* Left Side: Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date ? dayjs(date) : null} // Convert to dayjs if needed
              onChange={(newValue) => setFieldValue("date", newValue ? newValue.format("YYYY-MM-DD") : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="filled"
                  error={date && Boolean(errors.date)}
                  helperText={date && errors.date}
                  sx={{ gridColumn: "span 1" }}
                />
              )}
            />
          </LocalizationProvider>

          {/* Right Side: Buttons */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Refresh Button */}
            <Tooltip title="Refresh">
              <IconButton onClick={() => window.location.reload()}>
                <RestartAltOutlined />
              </IconButton>
            </Tooltip>

            {/* Menu Icon */}
            <Tooltip title="Show Checked Codes">
              <IconButton onClick={handleMenuClick}>
                <WidgetsOutlined />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            >
              {allCodes
                .filter((item) => roomData.some((room) => room.selections[item.code]))
                .map((item) => (
                  <MenuItem key={item.code}>{item.code}</MenuItem>
                ))}
            </Menu>

            {/* Export Data Icon */}
            <Tooltip title="Export Data">
              <IconButton onClick={handleExportClick}>
                <FileDownload />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={exportAnchor}
              open={Boolean(exportAnchor)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={() => handleExportOption("Excel")}>Excel</MenuItem>
              <MenuItem onClick={() => handleExportOption("MS-Excel")}>
                MS-Excel
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
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
                  sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
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
              <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
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

