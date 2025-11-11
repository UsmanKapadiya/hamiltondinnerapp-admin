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
                                        onChange={(newValue) => setStartDate(newValue)}
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
                                        onChange={(newValue) => setEndDate(newValue)}
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
                                            Room No
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={data?.breakfast_item_list?.length || 0}
                                        >
                                            Breakfast
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={data?.lunch_item_list?.length || 0}
                                        >
                                            Lunch
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            colSpan={data?.dinner_item_list?.length || 0}
                                        >
                                            Dinner
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                                        {data?.breakfast_item_list?.map((item, idx) => (
                                            <TableCell
                                                key={`breakfast-${idx}`}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                {selectedSummaryType === "Single Date Record" ? (
                                                    // <Tooltip title={item.real_item_name} arrow>
                                                        <span>{item.item_name}</span>
                                                    // </Tooltip>
                                                ) : (
                                                    Array.isArray(item.data) ? (
                                                        // <Tooltip
                                                        //     title={
                                                        //         <div>
                                                        //             {item.data.map((subItem, subIdx) => (
                                                        //                 <div key={`tooltip-${idx}-${subIdx}`}>
                                                        //                     {subItem.date} - {subItem.real_item_name}
                                                        //                 </div>
                                                        //             ))}
                                                        //         </div>
                                                        //     }
                                                        //     arrow
                                                        // >
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    ) : (
                                                        // <Tooltip title={item.data?.real_item_name} arrow>
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                        {data?.lunch_item_list?.map((item, idx) => (
                                            <TableCell
                                                key={`lunch-${idx}`}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                {selectedSummaryType === "Single Date Record" ? (
                                                    // <Tooltip title={item.real_item_name} arrow>
                                                        <span>{item.item_name}</span>
                                                    // </Tooltip>
                                                ) : (
                                                    Array.isArray(item.data) ? (
                                                        // <Tooltip
                                                        //     title={
                                                        //         <div>
                                                        //             {item.data.map((subItem, subIdx) => (
                                                        //                 <div key={`tooltip-${idx}-${subIdx}`}>
                                                        //                     {subItem.date} - {subItem.real_item_name}
                                                        //                 </div>
                                                        //             ))}
                                                        //         </div>
                                                        //     }
                                                        //     arrow
                                                        // >
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    ) : (
                                                        // <Tooltip title={item.data?.real_item_name} arrow>
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                        {data?.dinner_item_list?.map((item, idx) => (
                                            <TableCell
                                                key={`dinner-${idx}`}
                                                align="center"
                                                sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}
                                            >
                                                {selectedSummaryType === "Single Date Record" ? (
                                                    // <Tooltip title={item.real_item_name} arrow>
                                                        <span>{item.item_name}</span>
                                                    // </Tooltip>
                                                ) : (
                                                    Array.isArray(item.data) ? (
                                                        // <Tooltip
                                                        //     title={
                                                        //         <div>
                                                        //             {item.data.map((subItem, subIdx) => (
                                                        //                 <div key={`tooltip-${idx}-${subIdx}`}>
                                                        //                     {subItem.date} - {subItem.real_item_name}
                                                        //                 </div>
                                                        //             ))}
                                                        //         </div>
                                                        //     }
                                                        //     arrow
                                                        // >
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    ) : (
                                                        // <Tooltip title={item.data?.real_item_name} arrow>
                                                            <span>{item?.item_name}</span>
                                                        // </Tooltip>
                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {(
                                        (!data?.report_breakfast_list || data.report_breakfast_list.length === 0) &&
                                        (!data?.report_lunch_list || data.report_lunch_list.length === 0) &&
                                        (!data?.report_dinner_list || data.report_dinner_list.length === 0)
                                    ) ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={
                                                    Math.max(
                                                        1 +
                                                        (data?.breakfast_item_list?.length || 0) +
                                                        (data?.lunch_item_list?.length || 0) +
                                                        (data?.dinner_item_list?.length || 0),
                                                        100
                                                    )
                                                }
                                                sx={{ 
                                                    textAlign: 'center',
                                                    verticalAlign: 'middle',
                                                    fontWeight: 600, 
                                                    fontSize: '1.1rem',
                                                    border: '1px solid rgba(224, 224, 224, 1)',
                                                    padding: '40px 0'
                                                }}
                                            >
                                                No Report Found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        // <TableRow sx={{ backgroundColor: colors.blueAccent[800] }}>
                                        //     <TableCell align="center" sx={{ fontWeight: 700, border: '1px solid rgba(224, 224, 224, 1)' }}>
                                        //         Total
                                        //     </TableCell>
                                        //     {/* Breakfast  */}
                                        //     {data?.breakfast_item_list?.map((_, i) => {
                                        //         const total = data?.report_breakfast_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                                        //         return (
                                        //             <TableCell key={`btot-${i}`} align="center" sx={{ fontWeight: 700, border: '1px solid rgba(224, 224, 224, 1)', color: 'red' }}>
                                        //                 {total}
                                        //             </TableCell>
                                        //         );
                                        //     })}
                                        //
                                        //     {data?.lunch_item_list?.map((_, i) => {
                                        //         const total = data?.report_lunch_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                                        //         return (
                                        //             <TableCell key={`ltot-${i}`} align="center" sx={{ fontWeight: 700, border: '1px solid rgba(224, 224, 224, 1)', color: 'red' }}>
                                        //                 {total}
                                        //             </TableCell>
                                        //         );
                                        //     })}
                                        //
                                        //     {data?.dinner_item_list?.map((_, i) => {
                                        //         const total = data?.report_dinner_list?.reduce((sum, row) => sum + (row?.quantity?.[i] ?? row?.data?.[i] ?? 0), 0);
                                        //         return (
                                        //             <TableCell key={`dtot-${i}`} align="center" sx={{ fontWeight: 700, border: '1px solid rgba(224, 224, 224, 1)', color: 'red' }}>
                                        //                 {total}
                                        //             </TableCell>
                                        //         );
                                        //     })}
                                        // </TableRow>
                                        null
                                    )}
                                    {/* Data displayed*/}
                                    {(() => {
                                        // Combine all unique room numbers from breakfast, lunch, and dinner
                                        const allRoomNos = new Set([
                                            ...(data?.report_breakfast_list || []).map(r => r.room_no),
                                            ...(data?.report_lunch_list || []).map(r => r.room_no),
                                            ...(data?.report_dinner_list || []).map(r => r.room_no)
                                        ]);

                                        return Array.from(allRoomNos).map((roomNo) => {
                                            const breakfastRow = data?.report_breakfast_list?.find(b => b.room_no === roomNo) || {};
                                            const lunchRow = data?.report_lunch_list?.find(l => l.room_no === roomNo) || {};
                                            const dinnerRow = data?.report_dinner_list?.find(d => d.room_no === roomNo) || {};

                                            return (
                                                <TableRow key={roomNo}>
                                                    <TableCell align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                        {roomNo}
                                                    </TableCell>
                                                    {/* Breakfast quantities */}
                                                    {data?.breakfast_item_list?.map((item, i) => {
                                                        const quantity = Array.isArray(breakfastRow?.data?.[item.item_name])
                                                            ? breakfastRow?.data?.[item.item_name].reduce((sum, val) => sum + val, 0)
                                                            : breakfastRow?.data?.[item.item_name] ?? '-';
                                                        let optionText = '';
                                                        if (Array.isArray(breakfastRow?.option?.[item.item_name])) {
                                                            optionText = breakfastRow?.option?.[item.item_name]
                                                                .map(opt => {
                                                                    let realName = '';
                                                                    if (Array.isArray(item.data)) {
                                                                        const found = item.data.find(d => d.date === opt.date);
                                                                        if (found) realName = found.real_item_name;
                                                                    } else if (item.data && item.data.real_item_name) {
                                                                        realName = item.data.real_item_name;
                                                                    }
                                                                    return `${opt.date}${realName ? `: ${realName}` : ''} - ${opt.optionName} (${opt.timesSelected}x)`;
                                                                })
                                                                .join('\n');
                                                        } else if (breakfastRow?.option?.[item.item_name]) {
                                                            optionText = `${item?.real_item_name} - ${breakfastRow?.option?.[item.item_name]}`;
                                                        }
                                                        const hasOption = optionText && optionText.trim() !== '';

                                                        return (
                                                            <TableCell key={`b-${i}`} align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                {hasOption ? (
                                                                    <Tooltip
                                                                        title={
                                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                                {optionText.split('\n').map((line, idx) => (
                                                                                    <div key={idx}>{line}</div>
                                                                                ))}
                                                                            </div>
                                                                        }
                                                                        arrow
                                                                    >
                                                                        <span
                                                                            onClick={() => showAlert(`${optionText}`)}
                                                                            style={{
                                                                                textDecoration: 'underline',
                                                                                cursor: 'pointer',
                                                                                color: colors.greenAccent[400]
                                                                            }}
                                                                        >
                                                                            {quantity}
                                                                        </span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    quantity
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    {/* Lunch quantities */}
                                                    {data?.lunch_item_list?.map((item, i) => {
                                                        const quantity = Array.isArray(lunchRow?.data?.[item.item_name])
                                                            ? lunchRow?.data?.[item.item_name].reduce((sum, val) => sum + val, 0)
                                                            : lunchRow?.data?.[item.item_name] ?? '-';
                                                        let optionText = '';
                                                        if (Array.isArray(lunchRow?.option?.[item.item_name])) {
                                                            optionText = lunchRow?.option?.[item.item_name]
                                                                .map(opt => {
                                                                    let realName = '';
                                                                    if (Array.isArray(item.data)) {
                                                                        const found = item.data.find(d => d.date === opt.date);
                                                                        if (found) realName = found.real_item_name;
                                                                    } else if (item.data && item.data.real_item_name) {
                                                                        realName = item.data.real_item_name;
                                                                    }
                                                                    return `${opt.date}${realName ? `: ${realName}` : ''} - ${opt.optionName} (${opt.timesSelected}x)`;
                                                                })
                                                                .join('\n');
                                                        } else if (lunchRow?.option?.[item.item_name]) {
                                                            optionText = `${item?.real_item_name} - ${lunchRow?.option?.[item.item_name]}`;
                                                        }
                                                        const hasOption = optionText && optionText.trim() !== '';
                                                        // console.log(hasOption);
                                                        // console.log(optionText);
                                                        // console.log(hasOption);

                                                        return (
                                                            <TableCell key={`l-${i}`} align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                {hasOption ? (
                                                                    <Tooltip
                                                                        title={
                                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                                {optionText.split('\n').map((line, idx) => (
                                                                                    <div key={idx}>{line}</div>
                                                                                ))}
                                                                            </div>
                                                                        }
                                                                        arrow
                                                                    >
                                                                        <span
                                                                            onClick={() => showAlert(`${optionText}`)}
                                                                            style={{
                                                                                textDecoration: 'underline',
                                                                                cursor: 'pointer',
                                                                                color: colors.greenAccent[400]
                                                                            }}
                                                                        >
                                                                            {quantity}
                                                                        </span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    quantity
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    {/* Dinner quantities */}
                                                    {data?.dinner_item_list?.map((item, i) => {
                                                        const quantity = Array.isArray(dinnerRow?.data?.[item.item_name])
                                                            ? dinnerRow?.data?.[item.item_name].reduce((sum, val) => sum + val, 0)
                                                            : dinnerRow?.data?.[item.item_name] ?? '-';
                                                        let optionText = '';
                                                        if (Array.isArray(dinnerRow?.option?.[item.item_name])) {
                                                            optionText = dinnerRow?.option?.[item.item_name]
                                                                .map(opt => {
                                                                    let realName = '';
                                                                    if (Array.isArray(item.data)) {
                                                                        const found = item.data.find(d => d.date === opt.date);
                                                                        if (found) realName = found.real_item_name;
                                                                    } else if (item.data && item.data.real_item_name) {
                                                                        realName = item.data.real_item_name;
                                                                    }
                                                                    return `${opt.date}${realName ? `: ${realName}` : ''} - ${opt.optionName} (${opt.timesSelected}x)`;
                                                                })
                                                                .join('\n');
                                                        } else if (dinnerRow?.option?.[item.item_name]) {
                                                            optionText = `${item?.real_item_name} - ${dinnerRow?.option?.[item.item_name]}`;
                                                        }
                                                        const hasOption = optionText && optionText.trim() !== '';

                                                        return (
                                                            <TableCell key={`d-${i}`} align="center" sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                {hasOption ? (
                                                                    <Tooltip
                                                                        title={
                                                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                                                {optionText.split('\n').map((line, idx) => (
                                                                                    <div key={idx}>{line}</div>
                                                                                ))}
                                                                            </div>
                                                                        }
                                                                        arrow
                                                                    >
                                                                        <span
                                                                            onClick={() => showAlert(`${optionText}`)}
                                                                            style={{
                                                                                textDecoration: 'underline',
                                                                                cursor: 'pointer',
                                                                                color: colors.greenAccent[400]
                                                                            }}
                                                                        >
                                                                            {quantity}
                                                                        </span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    quantity
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        });
                                    })()}
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