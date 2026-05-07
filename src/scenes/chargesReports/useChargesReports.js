import { useEffect, useMemo, useState, useCallback } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import ReportServices from "../../services/reportServices";

export const SUMMARY_TYPES = {
    SINGLE: "Single Date Record",
    MULTIPLE: "Multiple Date Record",
};

const useChargesReports = () => {

    const [date, setDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs());

    const [selectedSummaryType, setSelectedSummaryType] = useState(
        SUMMARY_TYPES.SINGLE
    );

    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({});
    const [error, setError] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    const isInvalidRange =
        startDate &&
        endDate &&
        dayjs(startDate).isAfter(endDate);

    const fetchData = useCallback(async () => {

        let mounted = true;

        try {

            setLoading(true);
            setError(null);

            let response;

            if (selectedSummaryType === SUMMARY_TYPES.SINGLE) {

                response = await ReportServices.getChargesReportList(
                    date.format("YYYY-MM-DD")
                );

            } else {

                if (!startDate || !endDate || isInvalidRange) {
                    return;
                }

                response =
                    await ReportServices.getMultipleDateChargesReportList(
                        startDate.format("YYYY-MM-DD"),
                        endDate.format("YYYY-MM-DD")
                    );
            }

            if (mounted) {
                setReportData(response?.data ?? response ?? {});
            }

        } catch (err) {

            console.error(err);

            if (mounted) {
                setError("Failed to fetch report");
                setReportData({});
            }

        } finally {

            if (mounted) {
                setLoading(false);
            }
        }

        return () => {
            mounted = false;
        };

    }, [
        date,
        startDate,
        endDate,
        selectedSummaryType,
        isInvalidRange
    ]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshCount]);

    const reportMaps = useMemo(() => {

        const breakfastList = reportData?.report_breakfast_list || [];
        const lunchList = reportData?.report_lunch_list || [];
        const dinnerList = reportData?.report_dinner_list || [];

        return {

            breakfastMap: _.keyBy(breakfastList, "room_no"),

            lunchMap: _.keyBy(lunchList, "room_no"),

            dinnerMap: _.keyBy(dinnerList, "room_no"),

            roomNos: _.sortBy(
                _.uniq([
                    ..._.map(breakfastList, "room_no"),
                    ..._.map(lunchList, "room_no"),
                    ..._.map(dinnerList, "room_no"),
                ]),
                (room) => Number(room)
            ),
        };

    }, [reportData]);

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

        reportData,

        error,

        isInvalidRange,

        refresh: () => setRefreshCount((prev) => prev + 1),

        ...reportMaps,
    };
};

export default useChargesReports;
