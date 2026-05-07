import * as XLSX from "xlsx";

const exportChargesReport = ({
    type,
    roomNos,
    breakfastMap,
    lunchMap,
    dinnerMap,
    reportData,
}) => {

    const rows = roomNos.map((room) => {

        const breakfastData = breakfastMap[room]?.data || {};
        const lunchData = lunchMap[room]?.data || {};
        const dinnerData = dinnerMap[room]?.data || {};

        const row = {
            Room: room,
        };

        reportData?.breakfast_item_list?.forEach((item) => {
            row[`Breakfast-${item.item_name}`] =
                breakfastData[item.item_name] ?? 0;
        });

        reportData?.lunch_item_list?.forEach((item) => {
            row[`Lunch-${item.item_name}`] =
                lunchData[item.item_name] ?? 0;
        });

        reportData?.dinner_item_list?.forEach((item) => {
            row[`Dinner-${item.item_name}`] =
                dinnerData[item.item_name] ?? 0;
        });

        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Report"
    );

    XLSX.writeFile(
        workbook,
        `ChargesReport.${type === "Excel" ? "xlsx" : "xls"}`
    );
};

export default exportChargesReport;