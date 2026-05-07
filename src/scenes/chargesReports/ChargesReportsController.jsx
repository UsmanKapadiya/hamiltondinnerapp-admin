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
    AssessmentOutlined,
    FileDownload,
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
import ChargesReportRow from "./ChargesReportRow";
import exportChargesReport from "../../utils/exportChargesReport";
import useChargesReports, {
    SUMMARY_TYPES,
} from "./useChargesReports";

const ChargesReports = () => {

    const theme = useTheme();

    const colors = tokens(theme.palette.mode);

    const { collapsed } = useContext(CollapsedContext);

    const tableBorder = "1px solid rgba(224, 224, 224, 1)";

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
        reportData,
        error,
        refresh,
        isInvalidRange,
        breakfastMap,
        lunchMap,
        dinnerMap,
        roomNos,
    } = useChargesReports();

    const [summaryAnchor, setSummaryAnchor] = useState(null);
    const [exportAnchor, setExportAnchor] = useState(null);
    const permissionList = useSelector(
        (state) => state?.permissionState?.permissionsList
    );
    const canView = hasPermission(
        permissionList,
        "read_OrderDetails"
    );

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

        exportChargesReport({
            type,
            roomNos,
            breakfastMap,
            lunchMap,
            dinnerMap,
            reportData,
        });

    }, [
        roomNos,
        breakfastMap,
        lunchMap,
        dinnerMap,
        reportData,
    ]);

    const breakfastItems =
        reportData?.breakfast_item_list || [];

    const lunchItems =
        reportData?.lunch_item_list || [];

    const dinnerItems =
        reportData?.dinner_item_list || [];

    return (
        <Box m="20px">

            <Header
                title="Charges Report"
                icon={<AssessmentOutlined />}
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
                                    Single Date
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        setSelectedSummaryType(
                                            SUMMARY_TYPES.MULTIPLE
                                        );
                                        setSummaryAnchor(null);
                                    }}
                                >
                                    Multiple Date
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
                                >
                                    Excel
                                </MenuItem>

                                <MenuItem
                                    onClick={() =>
                                        handleExport("MS")
                                    }
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

                                   
                                    <TableHead>

                                        {/* TOP HEADER */}

                                        <TableRow
                                            sx={{
                                                backgroundColor: colors.blueAccent[700],
                                            }}
                                        >

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

                                            {/* BREAKFAST */}

                                            <TableCell
                                                align="center"
                                                colSpan={breakfastItems.length || 1}
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Breakfast
                                            </TableCell>

                                            {/* LUNCH */}

                                            <TableCell
                                                align="center"
                                                colSpan={lunchItems.length || 1}
                                                sx={{
                                                    border: tableBorder,
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Lunch
                                            </TableCell>

                                            {/* DINNER */}

                                            <TableCell
                                                align="center"
                                                colSpan={dinnerItems.length || 1}
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

                                        <TableRow
                                            sx={{
                                                backgroundColor: colors.blueAccent[600],
                                            }}
                                        >

                                            {/* BREAKFAST HEADER */}

                                            {breakfastItems.length > 0 ? (

                                                breakfastItems.map((item, index) => (

                                                    <TableCell
                                                        key={`b-${index}`}
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

                                                ))

                                            ) : (

                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    -
                                                </TableCell>

                                            )}

                                            {/* LUNCH HEADER */}

                                            {lunchItems.length > 0 ? (

                                                lunchItems.map((item, index) => (

                                                    <TableCell
                                                        key={`l-${index}`}
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

                                                ))

                                            ) : (

                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    -
                                                </TableCell>

                                            )}

                                            {/* DINNER HEADER */}

                                            {dinnerItems.length > 0 ? (

                                                dinnerItems.map((item, index) => (

                                                    <TableCell
                                                        key={`d-${index}`}
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

                                                ))

                                            ) : (

                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    -
                                                </TableCell>

                                            )}

                                        </TableRow>

                                    </TableHead>

                                    <TableBody>

                                        {roomNos.length === 0 ? (

                                            <TableRow>

                                                <TableCell
                                                    colSpan={50}
                                                    align="center"
                                                    sx={{
                                                        border: tableBorder,
                                                        py: 3,
                                                    }}
                                                >
                                                    No Report Found
                                                </TableCell>

                                            </TableRow>

                                        ) : (

                                            roomNos.map((room) => (

                                                <ChargesReportRow
                                                    key={room}
                                                    room={room}
                                                    breakfastItems={breakfastItems}
                                                    lunchItems={lunchItems}
                                                    dinnerItems={dinnerItems}
                                                    breakfastMap={breakfastMap}
                                                    lunchMap={lunchMap}
                                                    dinnerMap={dinnerMap}
                                                    tableBorder={tableBorder}
                                                />

                                            ))

                                        )}

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

export default ChargesReports;