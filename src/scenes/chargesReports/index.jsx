import React from "react";
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
    TextField
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Header } from "../../components";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { tokens } from "../../theme";
import { AssessmentOutlined, FileDownload, LocalPizzaOutlined, RestartAltOutlined, SummarizeOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReportServices from "../../services/reportServices";
import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import * as XLSX from "xlsx";

const ChargesReports = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [date, setDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs().startOf('month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [summaryAnchor, setSummaryAnchor] = useState(null);
    const [selectedSummaryType, setSelectedSummaryType] = useState("Single Date Record");
    const [exportAnchor, setExportAnchor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const permissionList = useSelector((state) => state?.permissionState?.permissionsList);

    useEffect(() => {
        // Single Date Record fetch
        if (selectedSummaryType === "Single Date Record") {
            const fetchReports = async () => {
                try {
                    setLoading(true);
                    const response = await ReportServices.getChargesReportList(date.format("YYYY-MM-DD"));
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
                    const response = await ReportServices.getMultipleDateChargesReportList(
                        dayjs(startDate).format("YYYY-MM-DD"),
                        dayjs(endDate).format("YYYY-MM-DD")
                    );
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

    const handleSummaryClick = (event) => {
        setSummaryAnchor(event.currentTarget);
        setSelectedSummaryType("Single Date Record"); // default selection when opened
    };
    const handleSummaryClose = () => setSummaryAnchor(null);
    const handleExportClick = (event) => setExportAnchor(event.currentTarget);
    const handleExportClose = () => setExportAnchor(null);

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertOpen(true);
    };

    const handleAlertConfirm = () => {
        setAlertOpen(false);
        setAlertMessage('');
    };

    const handleExportOption = async (option) => {
        handleExportClose();
        try {
            setLoading(true);

            // Combine all unique room numbers
            const allRoomNos = new Set([
                ...(data?.report_breakfast_list || []).map(r => r.room_no),
                ...(data?.report_lunch_list || []).map(r => r.room_no),
                ...(data?.report_dinner_list || []).map(r => r.room_no)
            ]);

            // Build export data
            const exportData = [];

            // Add header row
            const headers = ["Room No"];
            data?.breakfast_item_list?.forEach(item => headers.push(`Breakfast - ${item.item_name}`));
            data?.lunch_item_list?.forEach(item => headers.push(`Lunch - ${item.item_name}`));
            data?.dinner_item_list?.forEach(item => headers.push(`Dinner - ${item.item_name}`));

            // Add Total row
            const totalRow = { "Room No": "Total" };
            data?.breakfast_item_list?.forEach((_, i) => {
                const total = data?.report_breakfast_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                totalRow[`Breakfast - ${data.breakfast_item_list[i].item_name}`] = total;
            });
            data?.lunch_item_list?.forEach((_, i) => {
                const total = data?.report_lunch_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                totalRow[`Lunch - ${data.lunch_item_list[i].item_name}`] = total;
            });
            data?.dinner_item_list?.forEach((_, i) => {
                const total = data?.report_dinner_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                totalRow[`Dinner - ${data.dinner_item_list[i].item_name}`] = total;
            });
            exportData.push(totalRow);

            // Add data rows for each room
            Array.from(allRoomNos).forEach((roomNo) => {
                const breakfastRow = data?.report_breakfast_list?.find(b => b.room_no === roomNo) || {};
                const lunchRow = data?.report_lunch_list?.find(l => l.room_no === roomNo) || {};
                const dinnerRow = data?.report_dinner_list?.find(d => d.room_no === roomNo) || {};

                const row = { "Room No": roomNo };

                // Add breakfast quantities
                data?.breakfast_item_list?.forEach((item, i) => {
                    row[`Breakfast - ${item.item_name}`] = breakfastRow?.quantity?.[i] ?? breakfastRow?.data?.[i] ?? '-';
                });

                // Add lunch quantities
                data?.lunch_item_list?.forEach((item, i) => {
                    row[`Lunch - ${item.item_name}`] = lunchRow?.quantity?.[i] ?? lunchRow?.data?.[i] ?? '-';
                });

                // Add dinner quantities
                data?.dinner_item_list?.forEach((item, i) => {
                    row[`Dinner - ${item.item_name}`] = dinnerRow?.quantity?.[i] ?? dinnerRow?.data?.[i] ?? '-';
                });

                exportData.push(row);
            });

            // Create worksheet and workbook
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ChargesReport");

            const fileExt = option === "Excel" ? "xlsx" : "xls";
            const fileType = option === "Excel"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "application/vnd.ms-excel";

            const wbout = XLSX.write(workbook, { bookType: fileExt, type: "array" });
            const blob = new Blob([wbout], { type: fileType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const fileName = selectedSummaryType === "Multiple Date Record"
                ? `ChargesReport_${startDate.format("YYYY-MM-DD")}_to_${endDate.format("YYYY-MM-DD")}.${fileExt}`
                : `ChargesReport_${date.format("YYYY-MM-DD")}.${fileExt}`;

            link.setAttribute("download", fileName);
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

    return (
        <Box m="20px">
            <Header
                title="Charges Reports"
                icon={<AssessmentOutlined />}
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
                                    disabled={(!data?.report_breakfast_list || data.report_breakfast_list.length === 0) &&
                                        (!data?.report_lunch_list || data.report_lunch_list.length === 0) &&
                                        (!data?.report_dinner_list || data.report_dinner_list.length === 0)}
                                >
                                    Excel
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleExportOption("MS-Excel")}
                                    disabled={(!data?.report_breakfast_list || data.report_breakfast_list.length === 0) &&
                                        (!data?.report_lunch_list || data.report_lunch_list.length === 0) &&
                                        (!data?.report_dinner_list || data.report_dinner_list.length === 0)}
                                >
                                    MS-Excel
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    {loading ? (
                        <CustomLoadingOverlay />
                    ) : (
                        <TableContainer component={Paper} sx={{ width: '95%', overflow: 'auto' }}>
                            <Table sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse' }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            rowSpan={2}
                                        >
                                            #
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={Math.max(data?.breakfast_item_list?.length || 0, 1)}
                                        >
                                            Breakfast
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={Math.max(data?.lunch_item_list?.length || 0, 1)}
                                        >
                                            Lunch
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={Math.max(data?.dinner_item_list?.length || 0, 1)}
                                        >
                                            Dinner
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                        {data?.breakfast_item_list && data.breakfast_item_list.length > 0 ? (
                                            data.breakfast_item_list.map((item, idx) => {
                                                const getTooltipTitle = () => {
                                                    if (item.real_item_name) {
                                                        return <div>{item.real_item_name}</div>;
                                                    } else if (item.data) {
                                                        if (Array.isArray(item.data)) {
                                                            return (
                                                                <div style={{ whiteSpace: 'pre-line' }}>
                                                                    {item.data.map((d, i) => (
                                                                        <div key={i}>{d.date}: {d.real_item_name}</div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        } else if (item.data.real_item_name) {
                                                            return <div>{item.data.real_item_name}</div>;
                                                        }
                                                    }
                                                    return <div>{item.item_name}</div>;
                                                };
                                                return (
                                                    <TableCell
                                                        key={`breakfast-${idx}`}
                                                        align="center"
                                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                    >
                                                        <Tooltip title={getTooltipTitle()} arrow>
                                                            <span>{item.item_name}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                );
                                            })
                                        ) : (
                                            <TableCell
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                -
                                            </TableCell>
                                        )}
                                        {data?.lunch_item_list && data.lunch_item_list.length > 0 ? (
                                            data.lunch_item_list.map((item, idx) => {
                                                const getTooltipTitle = () => {
                                                    if (item.real_item_name) {
                                                        return <div>{item.real_item_name}</div>;
                                                    } else if (item.data) {
                                                        if (Array.isArray(item.data)) {
                                                            return (
                                                                <div style={{ whiteSpace: 'pre-line' }}>
                                                                    {item.data.map((d, i) => (
                                                                        <div key={i}>{d.date}: {d.real_item_name}</div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        } else if (item.data.real_item_name) {
                                                            return <div>{item.data.real_item_name}</div>;
                                                        }
                                                    }
                                                    return <div>{item.item_name}</div>;
                                                };
                                                return (
                                                    <TableCell
                                                        key={`lunch-${idx}`}
                                                        align="center"
                                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                    >
                                                        <Tooltip title={getTooltipTitle()} arrow>
                                                            <span>{item.item_name}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                );
                                            })
                                        ) : (
                                            <TableCell
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                -
                                            </TableCell>
                                        )}
                                        {data?.dinner_item_list && data.dinner_item_list.length > 0 ? (
                                            data.dinner_item_list.map((item, idx) => {
                                                const getTooltipTitle = () => {
                                                    if (item.real_item_name) {
                                                        return <div>{item.real_item_name}</div>;
                                                    } else if (item.data) {
                                                        if (Array.isArray(item.data)) {
                                                            return (
                                                                <div style={{ whiteSpace: 'pre-line' }}>
                                                                    {item.data.map((d, i) => (
                                                                        <div key={i}>{d.date}: {d.real_item_name}</div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        } else if (item.data.real_item_name) {
                                                            return <div>{item.data.real_item_name}</div>;
                                                        }
                                                    }
                                                    return <div>{item.item_name}</div>;
                                                };
                                                return (
                                                    <TableCell
                                                        key={`dinner-${idx}`}
                                                        align="center"
                                                        sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                                    >
                                                        <Tooltip title={getTooltipTitle()} arrow>
                                                            <span>{item.item_name}</span>
                                                        </Tooltip>
                                                    </TableCell>
                                                );
                                            })
                                        ) : (
                                            <TableCell
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                -
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* No data message */}
                                    {(
                                        (!data?.report_breakfast_list || data.report_breakfast_list.length === 0) &&
                                        (!data?.report_lunch_list || data.report_lunch_list.length === 0) &&
                                        (!data?.report_dinner_list || data.report_dinner_list.length === 0)
                                    ) ? (
                                        <TableRow>
                                            <TableCell 
                                                colSpan={
                                                    Math.max(
                                                        1 + (data?.breakfast_item_list?.length || 0) + (data?.lunch_item_list?.length || 0) + (data?.dinner_item_list?.length || 0),
                                                        4
                                                    )
                                                } 
                                                align="center"
                                                sx={{ 
                                                    border: '1px solid rgba(224, 224, 224, 1)',
                                                    padding: '40px',
                                                    fontSize: '16px',
                                                    fontWeight: 500,
                                                    color: colors.gray[500]
                                                }}
                                            >
                                                No Report Found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        (() => {
                                            const roomNos = [
                                                ...(data?.report_breakfast_list?.map(r => r.room_no) || []),
                                                ...(data?.report_lunch_list?.map(r => r.room_no) || []),
                                                ...(data?.report_dinner_list?.map(r => r.room_no) || []),
                                            ];
                                            const uniqueRoomNos = [...new Set(roomNos)];
                                            const baseList = uniqueRoomNos.map(room_no => ({
                                                room_no
                                            }));
                                            return baseList.map((row, idx) => {
                                                const breakfastRow = data?.report_breakfast_list?.find(b => b.room_no === row.room_no) || { data: {}, option: {} };
                                                const lunchRow = data?.report_lunch_list?.find(l => l.room_no === row.room_no) || { data: {}, option: {} };
                                                const dinnerRow = data?.report_dinner_list?.find(d => d.room_no === row.room_no) || { data: {}, option: {} };
                                                return (
                                                    <TableRow key={row.room_no}>
                                                        <TableCell align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                            {row.room_no}
                                                        </TableCell>
                                                        {/* Breakfast, Lunch, Dinner quantities */}
                                                        {[{
                                                            row: breakfastRow,
                                                            itemList: data?.breakfast_item_list,
                                                            prefix: 'b'
                                                        }, {
                                                            row: lunchRow,
                                                            itemList: data?.lunch_item_list,
                                                            prefix: 'l'
                                                        }, {
                                                            row: dinnerRow,
                                                            itemList: data?.dinner_item_list,
                                                            prefix: 'd'
                                                        }].map(({ row, itemList, prefix }, mealIdx) => (
                                                            <>
                                                                {itemList && itemList.length > 0 ? (
                                                                    itemList.map((item, i) => {
                                                                        const itemKey = item?.item_name || "";
                                                                        let qty = row.data?.[itemKey];
                                                                        const optionRaw = row.option?.[itemKey];
                                                                    
                                                                        // Get real_item_name from either format
                                                                        let realItemName = "";
                                                                        if (item.real_item_name) {
                                                                            realItemName = item.real_item_name;
                                                                        } else if (item.data) {
                                                                            if (Array.isArray(item.data)) {
                                                                                realItemName = item.data[0]?.real_item_name || "";
                                                                            } else if (item.data.real_item_name) {
                                                                                realItemName = item.data.real_item_name;
                                                                            }
                                                                        }
                                                                        
                                                                        // Handle both string (single date) and array (multi date) formats
                                                                        let option = "";
                                                                        let popupText = "";
                                                                        let popupLines = [];
                                                                        
                                                                        if (Array.isArray(optionRaw)) {
                                                                            // Check if it's multiple date format (with date and items structure)
                                                                            const isMultipleDateFormat = optionRaw.length > 0 && optionRaw[0]?.date && optionRaw[0]?.items;
                                                                            
                                                                            if (isMultipleDateFormat) {
                                                                                optionRaw.forEach(dateGroup => {
                                                                                    if (dateGroup.date && Array.isArray(dateGroup.items)) {
                                                                                        dateGroup.items.forEach(itemObj => {
                                                                                            if (itemObj.itemName) {
                                                                                                // Get the real item name for this specific date
                                                                                                let dateSpecificName = realItemName;
                                                                                                if (Array.isArray(item.data)) {
                                                                                                    const found = item.data.find(d => d.date === dateGroup.date);
                                                                                                    if (found && found.real_item_name) {
                                                                                                        dateSpecificName = found.real_item_name;
                                                                                                    }
                                                                                                }
                                                                                                popupLines.push(`${dateGroup.date}: ${dateSpecificName} - ${itemObj.itemName}`);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                                option = popupLines.join(', ');
                                                                                popupText = popupLines.join('\n');
                                                                            } else {
                                                                                popupLines = optionRaw
                                                                                    .filter(opt => opt && (typeof opt === 'object' ? (opt.itemName || opt.optionName) : opt))
                                                                                    .map(opt => {
                                                                                        if (typeof opt === 'object' && (opt.itemName || opt.optionName)) {
                                                                                            const optName = opt.itemName || opt.optionName;
                                                                                            return `${realItemName} - ${optName}`;
                                                                                        }
                                                                                        return typeof opt === 'string' ? `${realItemName} - ${opt}` : '';
                                                                                    })
                                                                                    .filter(opt => opt.trim().length > 0);
                                                                                option = popupLines.join(', ');
                                                                                popupText = popupLines.join('\n');
                                                                            }
                                                                        } else if (typeof optionRaw === 'string') {
                                                                            option = optionRaw;
                                                                            popupText = `${realItemName} - ${optionRaw}`;
                                                                            popupLines = [popupText];
                                                                        }
                                                                        
                                                                        const showPopup = qty >= 1 && option && option.trim().length > 0;
                                                                        
                                                                        return (
                                                                            <TableCell key={`${prefix}-${i}`} align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                {qty === undefined || qty === null ? (
                                                                                    '-'
                                                                                ) : showPopup ? (
                                                                                    <Tooltip
                                                                                        title={
                                                                                            <div>
                                                                                                {popupLines.map((line, lineIdx) => (
                                                                                                    <div key={lineIdx}>{line}</div>
                                                                                                ))}
                                                                                            </div>
                                                                                        }
                                                                                        arrow
                                                                                    >
                                                                                        <span
                                                                                            onClick={() => showAlert(
                                                                                                <div>
                                                                                                    {popupLines.map((line, lineIdx) => (
                                                                                                        <div key={lineIdx}>{line}</div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                            style={{
                                                                                                textDecoration: 'underline',
                                                                                                cursor: 'pointer',
                                                                                                color: colors.greenAccent[400]
                                                                                            }}
                                                                                        >
                                                                                            {qty}
                                                                                        </span>
                                                                                    </Tooltip>
                                                                                ) : (
                                                                                    qty
                                                                                )}
                                                                            </TableCell>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <TableCell align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                        -
                                                                    </TableCell>
                                                                )}
                                                            </>
                                                        ))}
                                                    </TableRow>
                                                );
                                            });
                                        })()
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            ) : (
                <NoPermissionMessage
                    title="You do not have permission to view Order Details."
                    message="Please contact your administrator if you believe this is a mistake."
                />
            )}

            {/* Custom Alert Dialog */}
            <ConfirmationDialog
                open={alertOpen}
                title=""
                message={alertMessage}
                onConfirm={handleAlertConfirm}
                onCancel={handleAlertConfirm}
                onCancelButton={false}
                confirmButtonLabel={true}
            />
        </Box>
    );
};

export default ChargesReports;