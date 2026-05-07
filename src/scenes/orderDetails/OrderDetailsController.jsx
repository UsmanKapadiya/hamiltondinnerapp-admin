import React, {
    useContext,
    useMemo,
    useState,
    useCallback,
} from "react";

import {
    Box,
    useTheme,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import {
    DatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
    FileDownload,
    LocalPizzaOutlined,
    RestartAltOutlined,
    SummarizeOutlined,
} from "@mui/icons-material";

import { useSelector } from "react-redux";

import { Header } from "../../components";

import { tokens } from "../../theme";

import CustomLoadingOverlay from "../../components/CustomLoadingOverlay";

import { hasPermission } from "../../components/permissions";

import NoPermissionMessage from "../../components/NoPermissionMessage";

import { CollapsedContext } from "../../App";

import useOrderDetailsReports, {
    SUMMARY_TYPES,
} from "./useOrderDetailsReports";

import OrderDetailsRow from "./OrderDetailsRow";

import exportOrderDetailsReport from "../../utils/exportOrderDetailsReport";

const OrderDetails = () => {

    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const { collapsed } = useContext(CollapsedContext);

    const tableBorder = "1px solid rgba(224, 224, 224, 1)";

    const permissionList = useSelector(
        (state) => state?.permissionState?.permissionsList
    );

    const canView = hasPermission(
        permissionList,
        "read_OrderDetails"
    );

    const {
        date,
        setDate,

        startDate,
        setStartDate,

        endDate,
        setEndDate,

        selectedSummaryType,
        setSelectedSummaryType,

        loading,

        data,

        rowsArray,

        error,

        refresh,

        isInvalidRange,

        columnKeys,

        getColumns,
    } = useOrderDetailsReports();

    const [summaryAnchor, setSummaryAnchor] = useState(null);

    const [exportAnchor, setExportAnchor] = useState(null);

    const commonDatePickerProps = useMemo(() => ({
        disabled: loading,
        slotProps: {
            textField: {
                fullWidth: false,
                variant: "filled",
            },
        },
    }), [loading]);

    const handleExport = useCallback((type) => {

        setExportAnchor(null);

        exportOrderDetailsReport({
            type,
            data,
            rowsArray,
            columnKeys,
            selectedSummaryType,
            date,
            startDate,
            endDate,
        });

    }, [
        data,
        rowsArray,
        columnKeys,
        selectedSummaryType,
        date,
        startDate,
        endDate,
    ]);

    return (
        <Box m="20px">

            <Header
                title="Order Details"
                icon={<LocalPizzaOutlined />}
            />

            {canView ? (
                <>

                    {/* FILTER */}

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={2}
                        gap={2}
                        flexWrap="wrap"
                    >

                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                        >

                            {selectedSummaryType ===
                                SUMMARY_TYPES.MULTIPLE ? (

                                <Box display="flex" gap={2}>

                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        maxDate={endDate}
                                        onChange={setStartDate}
                                        {...commonDatePickerProps}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: "filled",
                                                error: isInvalidRange,
                                                helperText: isInvalidRange
                                                    ? "Start date must be before end date"
                                                    : "",
                                            },
                                        }}
                                    />

                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        minDate={startDate}
                                        onChange={setEndDate}
                                        {...commonDatePickerProps}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: "filled",
                                                error: isInvalidRange,
                                                helperText: isInvalidRange
                                                    ? "End date must be after start date"
                                                    : "",
                                            },
                                        }}
                                    />

                                </Box>

                            ) : (

                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={setDate}
                                    {...commonDatePickerProps}
                                />

                            )}

                        </LocalizationProvider>

                        {/* ACTIONS */}

                        <Box>

                            <IconButton
                                onClick={(e) =>
                                    setSummaryAnchor(e.currentTarget)
                                }
                            >
                                <SummarizeOutlined />
                            </IconButton>

                            <Menu
                                anchorEl={summaryAnchor}
                                open={Boolean(summaryAnchor)}
                                onClose={() =>
                                    setSummaryAnchor(null)
                                }
                            >

                                <MenuItem
                                    onClick={() => {
                                        setSelectedSummaryType(
                                            SUMMARY_TYPES.SINGLE
                                        );

                                        setSummaryAnchor(null);
                                    }}
                                >
                                    Single Date Record
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        setSelectedSummaryType(
                                            SUMMARY_TYPES.MULTIPLE
                                        );

                                        setSummaryAnchor(null);
                                    }}
                                >
                                    Multiple Date Record
                                </MenuItem>

                            </Menu>

                            <IconButton onClick={refresh}>
                                <RestartAltOutlined />
                            </IconButton>

                            <IconButton
                                onClick={(e) =>
                                    setExportAnchor(e.currentTarget)
                                }
                            >
                                <FileDownload />
                            </IconButton>

                            <Menu
                                anchorEl={exportAnchor}
                                open={Boolean(exportAnchor)}
                                onClose={() =>
                                    setExportAnchor(null)
                                }
                            >

                                <MenuItem
                                    onClick={() =>
                                        handleExport("Excel")
                                    }
                                    disabled={!rowsArray.length}
                                >
                                    Excel
                                </MenuItem>

                                <MenuItem
                                    onClick={() =>
                                        handleExport("MS")
                                    }
                                    disabled={!rowsArray.length}
                                >
                                    MS Excel
                                </MenuItem>

                            </Menu>

                        </Box>

                    </Box>

                    {/* TABLE */}

                    {loading ? (

                        <CustomLoadingOverlay />

                    ) : error ? (

                        <Typography color="error">
                            {error}
                        </Typography>

                    ) : rowsArray.length === 0 ? (

                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ py: 3 }}
                        >
                            No Data Available for the selected date.
                        </Typography>

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
                                        minWidth: 650,
                                    }}
                                >

                                    <TableHead>

                                        {/* TOP HEADER */}

                                        <TableRow
                                            sx={{
                                                backgroundColor:
                                                    colors.blueAccent[700],
                                            }}
                                        >

                                            {getColumns(0).map((item, index) => (

                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    {...(index === 0
                                                        ? {
                                                            rowSpan:
                                                                item?.rowspan,
                                                        }
                                                        : {
                                                            colSpan:
                                                                item?.colspan,
                                                        })}
                                                >
                                                    {item?.title}
                                                </TableCell>

                                            ))}

                                        </TableRow>

                                        {/* SUB HEADER */}

                                        <TableRow
                                            sx={{
                                                backgroundColor:
                                                    colors.blueAccent[700],
                                            }}
                                        >

                                            {getColumns(
                                                data?.columns?.length - 2
                                            ).map((item, index) => (

                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {item.title}
                                                </TableCell>

                                            ))}

                                        </TableRow>

                                        {/* ITEM HEADER */}

                                        <TableRow
                                            sx={{
                                                backgroundColor:
                                                    colors.blueAccent[600],
                                            }}
                                        >

                                            {columnKeys.map((key, index) => (

                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {key}
                                                </TableCell>

                                            ))}

                                        </TableRow>

                                        {/* TOTAL ROW */}

                                        <TableRow>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    border: tableBorder,
                                                    fontWeight: "bold",
                                                    backgroundColor:
                                                        colors.primary[400],
                                                }}
                                            />

                                            {columnKeys.map((key, index) => (

                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        fontWeight: "bold",
                                                        backgroundColor:
                                                            colors.primary[400],
                                                        color:
                                                            colors.redAccent[800],
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {data?.total?.[key] ?? ""}
                                                </TableCell>

                                            ))}

                                        </TableRow>

                                    </TableHead>

                                    <TableBody>

                                        {rowsArray.map((room, index) => (

                                            <OrderDetailsRow
                                                key={index}
                                                room={room}
                                                columnKeys={columnKeys}
                                                tableBorder={tableBorder}
                                            />

                                        ))}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        </Box>

                    )}

                </>
            ) : (
                <NoPermissionMessage
                    title="No Permission"
                    message="Contact Admin"
                />
            )}

        </Box>
    );
};

export default OrderDetails;
