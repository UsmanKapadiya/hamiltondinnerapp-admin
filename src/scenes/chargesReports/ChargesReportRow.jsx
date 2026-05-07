import React from "react";
import {
    TableCell,
    TableRow,
} from "@mui/material";

const ChargesReportRow = ({
    room,
    breakfastItems,
    lunchItems,
    dinnerItems,
    breakfastMap,
    lunchMap,
    dinnerMap,
    tableBorder,
}) => {

    return (
        <TableRow>

            {/* ROOM */}

            <TableCell
                align="center"
                sx={{ border: tableBorder }}
            >
                {room}
            </TableCell>

            {/* BREAKFAST */}

            {breakfastItems.length > 0 ? (

                breakfastItems.map((item, idx) => (

                    <TableCell
                        key={`b-${idx}`}
                        align="center"
                        sx={{ border: tableBorder }}
                    >
                        {breakfastMap[room]?.data?.[item.item_name] ?? "-"}
                    </TableCell>

                ))

            ) : (

                <TableCell
                    align="center"
                    sx={{ border: tableBorder }}
                >
                    -
                </TableCell>

            )}

            {/* LUNCH */}

            {lunchItems.length > 0 ? (

                lunchItems.map((item, idx) => (

                    <TableCell
                        key={`l-${idx}`}
                        align="center"
                        sx={{ border: tableBorder }}
                    >
                        {lunchMap[room]?.data?.[item.item_name] ?? "-"}
                    </TableCell>

                ))

            ) : (

                <TableCell
                    align="center"
                    sx={{ border: tableBorder }}
                >
                    -
                </TableCell>

            )}

            {/* DINNER */}

            {dinnerItems.length > 0 ? (

                dinnerItems.map((item, idx) => (

                    <TableCell
                        key={`d-${idx}`}
                        align="center"
                        sx={{ border: tableBorder }}
                    >
                        {dinnerMap[room]?.data?.[item.item_name] ?? "-"}
                    </TableCell>

                ))

            ) : (

                <TableCell
                    align="center"
                    sx={{ border: tableBorder }}
                >
                    -
                </TableCell>

            )}

        </TableRow>
    );
};

export default React.memo(ChargesReportRow);
