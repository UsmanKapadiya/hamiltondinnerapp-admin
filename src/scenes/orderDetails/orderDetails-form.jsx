import { Box, Button, TextField, useMediaQuery, Switch, FormGroup, FormControlLabel, Autocomplete, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";
import { ClearAllOutlined, CreateOutlined, DvrOutlined, Home, LocalPizzaOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { mockDataItems, mockDataRomm } from "../../data/mockData";


const validationSchema = yup.object().shape({
    room_details: yup.string().required("Room is required"),
    item_details: yup.string().required("Item is required"),


});


const OrderDetailsForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const OrderDetails = location.state;
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const initialValues = {
        room_details: OrderDetails?.room_details || "",
        item_details: OrderDetails?.item_details || "",
    };


 

    const handleFormSubmit = (values, actions) => {
        console.log("Form Submitted:", values);
        actions.resetForm({
            values: initialValues,
        });
    };

    return (
        <Box m="20px">
            <Header title="Add Order Detail" icon={<LocalPizzaOutlined />} Buttons={false} />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": {
                                    gridColumn: isNonMobile ? undefined : "span 8",
                                },
                            }}
                        >
                            <Autocomplete
                                options={mockDataRomm}
                                getOptionLabel={(option) => `${option.unitNumber}`}
                                value={mockDataRomm.find((option) => option.unitNumber === values.room_details) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("room_details", newValue ? newValue.unitNumber : "");
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Room Details"
                                        variant="filled"
                                        error={touched.room_details && Boolean(errors.room_details)}
                                        helperText={touched.room_details && errors.room_details}
                                    />
                                )}
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box >
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            mt="20px"
                            sx={{
                                "& > div": {
                                    gridColumn: isNonMobile ? undefined : "span 8",
                                },
                            }}
                        >
                            <Autocomplete
                                options={mockDataItems}
                                getOptionLabel={(option) => option.itemName}
                                value={mockDataItems.find((option) => option.itemName === values.item_details) || null}
                                onChange={(event, newValue) => {
                                    setFieldValue("item_details", newValue ? newValue.itemName : ""); // Update parentId correctly
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Item Details"
                                        variant="filled"
                                        error={touched.item_details && Boolean(errors.item_details)}
                                        helperText={touched.item_details && errors.item_details}
                                    />
                                )}
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="end"
                            mt="20px"
                        >
                            <Button type="submit" color="secondary" variant="contained">
                                Save Order Details
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default OrderDetailsForm;