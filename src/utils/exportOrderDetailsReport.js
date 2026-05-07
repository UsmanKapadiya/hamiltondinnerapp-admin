import * as XLSX from "xlsx";

const exportOrderDetailsReport = ({
    type,
    data,
    rowsArray,
    columnKeys,
    selectedSummaryType,
    date,
    startDate,
    endDate,
}) => {

    const exportData = [];

    if (data?.total) {

        const totalRow = {
            "Room No": "Total",
        };

        columnKeys.forEach((key) => {
            totalRow[key] =
                data.total[key] ?? "";
        });

        exportData.push(totalRow);
    }

    rowsArray.forEach((room) => {

        const row = {
            "Room No":
                room.room_name || room.room_id,
        };

        columnKeys.forEach((key) => {
            row[key] = room[key] ?? "";
        });

        exportData.push(row);

    });

    const worksheet =
        XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "OrderReport"
    );

    const extension =
        type === "Excel"
            ? "xlsx"
            : "xls";

    const fileName =
        selectedSummaryType ===
            "Multiple Date Record"
            ? `OrderReport_${startDate.format(
                "YYYY-MM-DD"
            )}_to_${endDate.format(
                "YYYY-MM-DD"
            )}.${extension}`
            : `OrderReport_${date.format(
                "YYYY-MM-DD"
            )}.${extension}`;

    XLSX.writeFile(
        workbook,
        fileName
    );
};

export default exportOrderDetailsReport;
