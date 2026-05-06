import React, { useContext, useState } from "react";
import {
    Box, useTheme,
    Table, TableHead, TableBody,
    TableRow, TableCell, TableContainer,
    Paper, Tooltip, IconButton,
    Menu, MenuItem,
    TextField, Typography
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Header } from "../../components";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { tokens } from "../../theme";

import {
    AssessmentOutlined,
    FileDownload,
    RestartAltOutlined,
    SummarizeOutlined
} from "@mui/icons-material";

import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";
import { hasPermission } from "../../components/permissions";
import { useSelector } from "react-redux";
import NoPermissionMessage from "../../components/NoPermissionMessage";
import * as XLSX from "xlsx";
import { CollapsedContext } from "../../App";
import useChargesReports from "./useChargesReports";

const ChargesReports = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { collapsed } = useContext(CollapsedContext);
const tableBorder = "1px solid rgba(224, 224, 224, 1)";
    const {
        date, setDate,
        startDate, setStartDate,
        endDate, setEndDate,
        selectedSummaryType, setSelectedSummaryType,
        loading, data, error,
        refresh,
        breakfastMap,
        lunchMap,
        dinnerMap,
        roomNos
    } = useChargesReports();

    const [summaryAnchor, setSummaryAnchor] = useState(null);
    const [exportAnchor, setExportAnchor] = useState(null);

    const permissionList = useSelector((state) => state?.permissionState?.permissionsList);
    const canView = hasPermission(permissionList, "read_OrderDetails");

    // ---------------- EXPORT ----------------
    const handleExport = (type) => {
        setExportAnchor(null);

        const rows = roomNos.map((room) => {
            const b = breakfastMap[room]?.data || {};
            const l = lunchMap[room]?.data || {};
            const d = dinnerMap[room]?.data || {};

            const row = { Room: room };

            data?.breakfast_item_list?.forEach(i => row[`B-${i.item_name}`] = b[i.item_name] ?? 0);
            data?.lunch_item_list?.forEach(i => row[`L-${i.item_name}`] = l[i.item_name] ?? 0);
            data?.dinner_item_list?.forEach(i => row[`D-${i.item_name}`] = d[i.item_name] ?? 0);

            return row;
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        XLSX.writeFile(
            wb,
            `ChargesReport.${type === "Excel" ? "xlsx" : "xls"}`
        );
    };

    return (
        <Box m="20px">

            <Header title="Charges Report" icon={<AssessmentOutlined />} />

            {canView ? (
                <>
                    {/* ================= FILTER ================= */}
                    <Box display="flex" justifyContent="space-between" mb={2}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            {selectedSummaryType === "Multiple Date Record" ? (
                                <Box display="flex" gap={2}>
                                    <DatePicker
                                        label="Start"
                                        value={startDate}
                                        onChange={setStartDate}
                                        slotProps={{ textField: { variant: "filled" } }}
                                    />
                                    <DatePicker
                                        label="End"
                                        value={endDate}
                                        onChange={setEndDate}
                                        slotProps={{ textField: { variant: "filled" } }}
                                    />
                                </Box>
                            ) : (
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={setDate}
                                    slotProps={{ textField: { variant: "filled" } }}
                                />
                            )}

                        </LocalizationProvider>

                        <Box>

                            <IconButton onClick={(e) => setSummaryAnchor(e.currentTarget)}>
                                <SummarizeOutlined />
                            </IconButton>

                            <Menu
                                anchorEl={summaryAnchor}
                                open={Boolean(summaryAnchor)}
                                onClose={() => setSummaryAnchor(null)}
                            >
                                <MenuItem onClick={() => setSelectedSummaryType("Single Date Record")}>
                                    Single Date
                                </MenuItem>
                                <MenuItem onClick={() => setSelectedSummaryType("Multiple Date Record")}>
                                    Multiple Date
                                </MenuItem>
                            </Menu>

                            <IconButton onClick={refresh}>
                                <RestartAltOutlined />
                            </IconButton>

                            <IconButton onClick={(e) => setExportAnchor(e.currentTarget)}>
                                <FileDownload />
                            </IconButton>

                            <Menu
                                anchorEl={exportAnchor}
                                open={Boolean(exportAnchor)}
                                onClose={() => setExportAnchor(null)}
                            >
                                <MenuItem onClick={() => handleExport("Excel")}>
                                    Excel
                                </MenuItem>
                                <MenuItem onClick={() => handleExport("MS")}>
                                    MS Excel
                                </MenuItem>
                            </Menu>

                        </Box>
                    </Box>

                    {/* ================= TABLE ================= */}
                    {loading ? (
                        <CustomLoadingOverlay />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Box
                            sx={{
                                overflowX: "auto",
                                width: "100%",
                                maxWidth: collapsed
                                    ? "calc(100vw - 80px - 40px)"
                                    : "calc(100vw - 250px - 40px)",
                                transition: "max-width 0.3s ease",
                            }}
                        >
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{
                                        border: tableBorder,
                                        borderCollapse: "collapse",
                                    }}
                                >

                                    {/* ================= HEADER ================= */}
                                    <TableHead>

                                        {/* TOP HEADER */}
                                        <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>

                                            <TableCell
                                                rowSpan={2}
                                                align="center"
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                #
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                colSpan={data?.breakfast_item_list?.length || 1}
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Breakfast
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                colSpan={data?.lunch_item_list?.length || 1}
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Lunch
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                colSpan={data?.dinner_item_list?.length || 1}
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Dinner
                                            </TableCell>

                                        </TableRow>

                                        {/* ITEM HEADER */}
                                        <TableRow sx={{ backgroundColor: colors.blueAccent[600] }}>

                                            {[...(data?.breakfast_item_list || []),
                                            ...(data?.lunch_item_list || []),
                                            ...(data?.dinner_item_list || [])].map((item, i) => (
                                                <TableCell
                                                    key={i}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {item.item_name}
                                                </TableCell>
                                            ))}

                                        </TableRow>
                                    </TableHead>

                                    {/* ================= BODY ================= */}
                                    <TableBody>

                                        {roomNos.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={50}
                                                    align="center"
                                                    sx={{ border: tableBorder, py: 3 }}
                                                >
                                                    No Data Found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            roomNos.map((room) => (
                                                <TableRow key={room}>

                                                    {/* ROOM NO */}
                                                    <TableCell align="center" sx={{ border: tableBorder }}>
                                                        {room}
                                                    </TableCell>

                                                    {/* BREAKFAST */}
                                                    {data?.breakfast_item_list?.map((i, idx) => (
                                                        <TableCell key={`b-${idx}`} align="center" sx={{ border: tableBorder }}>
                                                            {breakfastMap[room]?.data?.[i.item_name] ?? 0}
                                                        </TableCell>
                                                    ))}

                                                    {/* LUNCH */}
                                                    {data?.lunch_item_list?.map((i, idx) => (
                                                        <TableCell key={`l-${idx}`} align="center" sx={{ border: tableBorder }}>
                                                            {lunchMap[room]?.data?.[i.item_name] ?? 0}
                                                        </TableCell>
                                                    ))}

                                                    {/* DINNER */}
                                                    {data?.dinner_item_list?.map((i, idx) => (
                                                        <TableCell key={`d-${idx}`} align="center" sx={{ border: tableBorder }}>
                                                            {dinnerMap[room]?.data?.[i.item_name] ?? 0}
                                                        </TableCell>
                                                    ))}

                                                </TableRow>
                                            ))
                                        )}

                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                </>
            ) : (
                <NoPermissionMessage title="No Permission" message="Contact Admin" />
            )}

        </Box>
    );
};

export default ChargesReports;
