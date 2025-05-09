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
  MenuItem,
  Typography

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
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState(new Date()); // Default date set to 2025-03-15
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    getReportsList(date)
  }, [date])

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
    handleExportClose();
  };

  useEffect(() => {
    getReportsList()
  }, [])

  const getReportsList = async (date) => {
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
              onChange={(newValue) => setDate(newValue ? newValue.format("YYYY-MM-DD") : null)} // Use setDate to update the state
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="filled"
                  error={date && Boolean(errors?.date)} // Ensure errors is defined
                  helperText={date && errors?.date} // Ensure errors is defined
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
              <IconButton onClick={data?.result?.rows?.length > 0 && handleMenuClick}>
                <WidgetsOutlined />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              sx={{
                maxHeight: 600, // Set the maximum height
                overflowY: 'auto', // Enable scrolling if content exceeds the height
              }}
            >
              {data?.columns?.length && data?.columns[data.columns.length - 1]?.map((item, key) => (
                <MenuItem key={key}>{item.field}</MenuItem>
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
          {loading ? (
            <CustomLoadingOverlay />
          ) : data && data?.result?.rows?.length > 0 ? (
            <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                  {data?.columns?.length && data?.columns[0]?.map((item, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      {...(index === 0
                        ? { rowSpan: item?.rowspan } // Dynamically set rowSpan for the first cell
                        : { colSpan: item?.colspan })} // Use colSpan otherwise
                    >
                      {item?.title}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Dynamically  columns Values Set */}
                <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                  {data?.columns?.length && data?.columns[data.columns.length - 2]?.map((item, key) => (
                    <TableCell
                      key={key}
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      {item.title}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Dynamically  columns Set */}
                <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                  {data?.columns?.length && data?.columns[data.columns.length - 1]?.map((item, key) => (
                    <TableCell
                      key={key}
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      {item.field}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>

                {data?.result?.rows.map((room, index) => (
                  <TableRow key={index}>
                    <TableCell
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                    >
                      {room.room_id}
                    </TableCell>
                    {Object.keys(room).filter(key => key !== 'room_id').map((key, subIndex) => (
                      <TableCell
                        key={subIndex}
                        align="center"
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        {room[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="h6" align="center" sx={{ padding: '20px' }}>
              No Data Available for the selected date.
            </Typography>
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default OrderDetails;

