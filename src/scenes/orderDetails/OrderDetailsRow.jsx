import React from "react";

import {
    TableRow,
    TableCell,
} from "@mui/material";

const OrderDetailsRow = ({
    room,
    columnKeys,
    tableBorder,
}) => {

    return (
        <TableRow>

            <TableCell
                align="center"
                sx={{
                    border: tableBorder,
                    whiteSpace: "nowrap",
                }}
            >
                {room.room_name || room.room_id}
            </TableCell>

            {columnKeys.map((key, index) => (

                <TableCell
                    key={index}
                    align="center"
                    sx={{
                        border: tableBorder,
                        whiteSpace: "nowrap",
                    }}
                >
                    {room[key] ?? ""}
                </TableCell>

            ))}

        </TableRow>
    );
};

export default React.memo(OrderDetailsRow);
