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
  Typography,
  TextField
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { FileDownload, LocalPizzaOutlined, RestartAltOutlined, SummarizeOutlined, WidgetsOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReportServices from "../../services/reportServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import * as XLSX from "xlsx";

const OrderDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [date, setDate] = useState(dayjs());
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs());
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [summaryAnchor, setSummaryAnchor] = useState(null);
  const [selectedSummaryType, setSelectedSummaryType] = useState("Single Date Record");
  const [exportAnchor, setExportAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [rowsArray, setRowsArray] = useState([]);
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

  useEffect(() => {
    // Single Date Record fetch
    if (selectedSummaryType === "Single Date Record") {
      const fetchReports = async () => {
        try {
          setLoading(true);
          const response = await ReportServices.getReportList(date.format("YYYY-MM-DD"));
          const rowsArray = Object.values(response?.result?.rows || {});
          setRowsArray(rowsArray);
          setData(response);
        } catch (error) {
          console.error("Error fetching menu list:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [date, selectedSummaryType]);

  useEffect(() => {
    // Multiple Date Record fetch
    if (
      selectedSummaryType === "Multiple Date Record" &&
      startDate && endDate &&
      dayjs(startDate).isValid() && dayjs(endDate).isValid()
    ) {
      const fetchReportsRange = async () => {
        try {
          setLoading(true);
          const response = await ReportServices.getMultipleDateReportList(
            dayjs(startDate).format("YYYY-MM-DD"),
            dayjs(endDate).format("YYYY-MM-DD")
          );
          const rowsArray = Object.values(response?.result?.rows || {});
          setRowsArray(rowsArray);
          setData(response);
        } catch (error) {
          console.error("Error fetching menu list:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReportsRange();
    }
  }, [startDate, endDate, selectedSummaryType]);

  const handleMenuClick = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);
  const handleSummaryClick = (event) => {
    setSummaryAnchor(event.currentTarget);
    setSelectedSummaryType("Single Date Record"); // default selection when opened
  };
  const handleSummaryClose = () => setSummaryAnchor(null);
  const handleExportClick = (event) => setExportAnchor(event.currentTarget);
  const handleExportClose = () => setExportAnchor(null);

  const handleExportOption = async (option) => {
    handleExportClose();
    try {
      setLoading(true);
      const rows = data?.result?.rows || [];
      // Get columns for export
      const columns =
        Array.isArray(data?.columns) &&
          Array.isArray(data.columns[data.columns.length - 1])
          ? data.columns[data.columns.length - 1]
          : [];
      // Add Room No column at the beginning
      const exportColumns = [{ field: "room_id", title: "Room No" }, ...columns];
      const exportData = rows.map(row =>
        exportColumns.reduce((acc, col) => {
          acc[col.title || col.field] = row[col.field];
          return acc;
        }, {})
      );
      // Set header row as titles
      const header = exportColumns.map(col => col.title || col.field);
      const worksheet = XLSX.utils.json_to_sheet(exportData, { header });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "OrderReport");
      const fileExt = option === "Excel" ? "xlsx" : "xls";
      const fileType = option === "Excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/vnd.ms-excel";
      const wbout = XLSX.write(workbook, { bookType: fileExt, type: "array" });
      const blob = new Blob([wbout], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `OrderReport_${date.format("YYYY-MM-DD")}.${fileExt}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const canView = hasPermission(permissionList, "read_OrderDetails");

  // Helper to safely get columns for mapping
  const getColumns = (idx) =>
    Array.isArray(data?.columns) && Array.isArray(data.columns[idx])
      ? data.columns[idx]
      : [];
  return (
    <Box m="20px">
      <Header
        title="Order Details"
        icon={<LocalPizzaOutlined />}
      />
      {canView ? (
        <Box
          mt="40px"
          height="75vh"
          flex={1}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
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
            {/* Left Side: Date Picker(s) */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {selectedSummaryType === "Multiple Date Record" ? (
                <Box display="flex" gap={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    maxDate={endDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        error: startDate && endDate && dayjs(startDate).isAfter(endDate),
                        helperText: startDate && endDate && dayjs(startDate).isAfter(endDate) 
                          ? "Start date must be before end date" 
                          : ""
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="filled"
                        sx={{ gridColumn: "span 1" }}
                      />
                    )}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    minDate={startDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                      textField: {
                        error: startDate && endDate && dayjs(endDate).isBefore(startDate),
                        helperText: startDate && endDate && dayjs(endDate).isBefore(startDate) 
                          ? "End date must be after start date" 
                          : ""
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="filled"
                        sx={{ gridColumn: "span 1" }}
                      />
                    )}
                  />
                </Box>
              ) : (
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 1" }}
                    />
                  )}
                />
              )}
            </LocalizationProvider>

            {/* Right Side: Buttons */}
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Summary Export">
                <IconButton onClick={handleSummaryClick}>
                  <SummarizeOutlined />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={summaryAnchor}
                open={Boolean(summaryAnchor)}
                onClose={handleSummaryClose}
              >
                <MenuItem
                  selected={selectedSummaryType === "Single Date Record"}
                  onClick={() => {
                    setSelectedSummaryType("Single Date Record");
                    handleSummaryClose();
                  }}
                >
                  Single Date Record
                </MenuItem>
                <MenuItem
                  selected={selectedSummaryType === "Multiple Date Record"}
                  onClick={() => {
                    setSelectedSummaryType("Multiple Date Record");
                    handleSummaryClose();
                  }}
                >
                  Multiple Date Record
                </MenuItem>
              </Menu>
              <Tooltip title="Refresh">
                <IconButton onClick={() => window.location.reload()}>
                  <RestartAltOutlined />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Show Checked Codes">
                <IconButton onClick={data?.result?.rows?.length > 0 ? handleMenuClick : undefined}>
                  <WidgetsOutlined />
                </IconButton>
              </Tooltip> 
               <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                sx={{
                  maxHeight: 600,
                  overflowY: 'auto',
                }}
              >
                {getColumns(data?.columns?.length - 1).map((item, key) => (
                  <MenuItem key={key}>{item.field}</MenuItem>
                ))}
              </Menu> */}
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
                <MenuItem
                  onClick={() => handleExportOption("Excel")}
                  disabled={!data?.result?.rows?.length}
                >
                  Excel
                </MenuItem>
                <MenuItem
                  onClick={() => handleExportOption("MS-Excel")}
                  disabled={!data?.result?.rows?.length}
                >
                  MS-Excel
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {loading ? (
            <CustomLoadingOverlay />
          ) : rowsArray.length > 0 ? (
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse', minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                        {getColumns(0).map((item, index) => (
                                            <TableCell
                                                key={index}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap' }}
                                                {...(index === 0
                                                    ? { rowSpan: item?.rowspan }
                                                    : { colSpan: item?.colspan })}
                                            >
                                                {item?.title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                    {getColumns(data?.columns?.length - 2).map((item, key) => (
                                        <TableCell
                                            key={key}
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap' }}
                                        >
                                            {item.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {/* Display BA B1 La .... */}
                                <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                    {data?.columns?.[1] && typeof data.columns[1] === 'object' && !Array.isArray(data.columns[1]) ? (
                                        Object.keys(data.columns[1]).map((key, index) => (
                                            <TableCell
                                                key={index}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap' }}
                                            >
                                                {key}
                                            </TableCell>
                                        ))
                                    ) : null}
                                </TableRow>
                                <TableRow>
                                    {/* First cell empty */}
                                    <TableCell
                                        align="center"
                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold', backgroundColor: colors.primary[400], whiteSpace: 'nowrap' }}
                                    >
                                    </TableCell>
                                    {/* Display total data */}
                                    {data?.columns?.[1] && typeof data.columns[1] === 'object' && !Array.isArray(data.columns[1]) ? (
                                        Object.keys(data.columns[1]).map((key, index) => (
                                            <TableCell
                                                key={index}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold', backgroundColor: colors.primary[400], color: colors.redAccent[800], whiteSpace: 'nowrap' }}
                                            >
                                                {data?.total?.[key] !== undefined ? data.total[key] : ''}
                                            </TableCell>
                                        ))
                                    ) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowsArray.map((room, index) => {
                                    // Get the column keys from index 1 of columns array
                                    const columnKeys = data?.columns?.[1] && typeof data.columns[1] === 'object' && !Array.isArray(data.columns[1]) 
                                        ? Object.keys(data.columns[1]) 
                                        : [];
                                    
                                    return (
                                        <TableRow key={index}>
                                            <TableCell
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap' }}
                                            >
                                                {room.room_name || room.room_id}
                                            </TableCell>
                                            {columnKeys.map((key, subIndex) => (
                                                <TableCell
                                                    key={subIndex}
                                                    align="center"
                                                    sx={{ border: '1px solid rgba(224, 224, 224, 1)', whiteSpace: 'nowrap' }}
                                                >
                                                    {room[key] !== undefined ? room[key] : ''}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Box>
          ) : (
            <Typography variant="h6" align="center" sx={{ padding: '20px' }}>
              No Data Available for the selected date.
            </Typography>
          )}
        </Box>
      ) : (
        <NoPermissionMessage
          title="You do not have permission to view Order Details."
          message="Please contact your administrator if you believe this is a mistake."
        />
      )}
    </Box>
  );
};

export default OrderDetails;