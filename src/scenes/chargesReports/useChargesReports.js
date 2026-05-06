import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import ReportServices from "../../services/reportServices";

const useChargesReports = () => {
    const [date, setDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs());
    const [selectedSummaryType, setSelectedSummaryType] = useState("Single Date Record");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;

                if (selectedSummaryType === "Single Date Record") {
                    response = await ReportServices.getChargesReportList(
                        date.format("YYYY-MM-DD")
                    );
                } else {
                    if (!startDate || !endDate) return;

                    response = await ReportServices.getMultipleDateChargesReportList(
                        startDate.format("YYYY-MM-DD"),
                        endDate.format("YYYY-MM-DD")
                    );
                }

                setData(response?.data ?? response ?? {});
            } catch (err) {
                console.error(err);
                setError("Failed to fetch report");
                setData({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [date, startDate, endDate, selectedSummaryType, refreshCount]);

    // 🔥 OPTIMIZED MAPS
    const maps = useMemo(() => ({
        breakfastMap: _.keyBy(data?.report_breakfast_list || [], "room_no"),
        lunchMap: _.keyBy(data?.report_lunch_list || [], "room_no"),
        dinnerMap: _.keyBy(data?.report_dinner_list || [], "room_no"),
        roomNos: _.uniq([
            ..._.map(data?.report_breakfast_list, "room_no"),
            ..._.map(data?.report_lunch_list, "room_no"),
            ..._.map(data?.report_dinner_list, "room_no"),
        ])
    }), [data]);

    return {
        date, setDate,
        startDate, setStartDate,
        endDate, setEndDate,
        selectedSummaryType, setSelectedSummaryType,
        loading,
        data,
        error,
        refresh: () => setRefreshCount(p => p + 1),
        ...maps
    };
};

export default useChargesReports;
