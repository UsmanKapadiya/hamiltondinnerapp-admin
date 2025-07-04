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
import { FileDownload, LocalPizzaOutlined, RestartAltOutlined, WidgetsOutlined } from "@mui/icons-material";
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await ReportServices.getReportList(date.format("YYYY-MM-DD"));
        setData(response);
      } catch (error) {
        console.error("Error fetching menu list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [date]);

  const handleMenuClick = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);
  const handleExportClick = (event) => setExportAnchor(event.currentTarget);
  const handleExportClose = () => setExportAnchor(null);

  const handleExportOption = async (option) => {
    handleExportClose();
    try {
      setLoading(true);
      const rows = data?.result?.rows || [];
      const columns =
        Array.isArray(data?.columns) &&
          Array.isArray(data.columns[data.columns.length - 1])
          ? data.columns[data.columns.length - 1]
          : [];
      const exportData = rows.map(row =>
        columns.reduce((acc, col) => {
          acc[col.field] = row[col.field];
          return acc;
        }, {})
      );
      const worksheet = XLSX.utils.json_to_sheet(exportData);
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
            {/* Left Side: Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            </LocalizationProvider>

            {/* Right Side: Buttons */}
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Refresh">
                <IconButton onClick={() => window.location.reload()}>
                  <RestartAltOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Show Checked Codes">
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
              </Menu>
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
          ) : data?.result?.rows?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                    {getColumns(0).map((item, index) => (
                      <TableCell
                        key={index}
                        align="center"
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
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
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        {item.title}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                    {getColumns(data?.columns?.length - 1).map((item, key) => (
                      <TableCell
                        key={key}
                        align="center"
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                      >
                        {item.field}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    {/* First cell empty */}
                    <TableCell
                      align="center"
                      sx={{ border: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold', backgroundColor: colors.primary[400] }}
                    >
                    </TableCell>
                    {/* Display total data */}
                    {getColumns(data?.columns?.length - 1).map((item, key) => (
                      <TableCell
                        key={key}
                        align="center"
                        sx={{ border: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold', backgroundColor: colors.primary[400],color:colors.redAccent[800] }}
                      >
                        {data?.total[item.field] !== undefined ? data?.total[item.field] : ''}
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
            </TableContainer>
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