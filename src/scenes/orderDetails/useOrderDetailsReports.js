import {
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";

import dayjs from "dayjs";

import ReportServices from "../../services/reportServices";

export const SUMMARY_TYPES = {
    SINGLE: "Single Date Record",
    MULTIPLE: "Multiple Date Record",
};

const useOrderDetailsReports = () => {

    const [date, setDate] = useState(dayjs());

    const [startDate, setStartDate] = useState(
        dayjs().startOf("month")
    );

    const [endDate, setEndDate] = useState(dayjs());

    const [selectedSummaryType, setSelectedSummaryType] =
        useState(SUMMARY_TYPES.SINGLE);

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({});

    const [rowsArray, setRowsArray] = useState([]);

    const [error, setError] = useState(null);

    const [refreshCount, setRefreshCount] = useState(0);

    const isInvalidRange =
        startDate &&
        endDate &&
        dayjs(startDate).isAfter(endDate);

    const fetchReports = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            let response;

            if (selectedSummaryType === SUMMARY_TYPES.SINGLE) {

                response =
                    await ReportServices.getReportList(
                        date.format("YYYY-MM-DD")
                    );

            } else {

                if (
                    !startDate ||
                    !endDate ||
                    isInvalidRange
                ) {
                    return;
                }

                response =
                    await ReportServices.getMultipleDateReportList(
                        startDate.format("YYYY-MM-DD"),
                        endDate.format("YYYY-MM-DD")
                    );
            }

            const rows =
                Object.values(
                    response?.result?.rows || {}
                );

            setRowsArray(rows);

            setData(response);

        } catch (err) {

            console.error(err);

            setError("Failed to fetch report");

            setRowsArray([]);

            setData({});

        } finally {

            setLoading(false);

        }

    }, [
        date,
        startDate,
        endDate,
        selectedSummaryType,
        isInvalidRange,
    ]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports, refreshCount]);

    const columnKeys = useMemo(() => {

        return data?.columns?.[1] &&
            typeof data.columns[1] === "object" &&
            !Array.isArray(data.columns[1])
            ? Object.keys(data.columns[1])
            : [];

    }, [data]);

    const getColumns = useCallback((idx) => {

        return Array.isArray(data?.columns?.[idx])
            ? data.columns[idx]
            : [];

    }, [data]);

    return {

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

        refresh: () =>
            setRefreshCount((prev) => prev + 1),

        isInvalidRange,

        columnKeys,

        getColumns,
    };
};

export default useOrderDetailsReports;
