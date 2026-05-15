import {
    Autocomplete,
    Box,
    Button,
    TextField,
    useMediaQuery,
} from "@mui/material";
import { DvrOutlined } from "@mui/icons-material";
import { Formik } from "formik";
import Header from "../../../components/Header";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";
import useItemDetailsForm from "./useItemDetailsForm";

const ItemDetailsForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const {
        loading,
        itemDetails,
        validationSchema,
        categoryData,
        optionData,
        preferencesData,
        getInitialValues,
        handleFormSubmit,
    } = useItemDetailsForm();

    return (
        <Box m="20px">
            <Header
                title={
                    loading
                        ? ""
                        : itemDetails?.id
                            ? "Update Menu Item Detail"
                            : "Add Menu Item Detail"
                }
                icon={<DvrOutlined />}
                Buttons={false}
            />

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="calc(100vh - 100px)"
                >
                    <CustomLoadingOverlay />
                </Box>
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                    validateOnBlur
                    validateOnChange
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
                                        gridColumn: isNonMobile
                                            ? undefined
                                            : "span 4",
                                    },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Menu Item Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.item_name}
                                    name="item_name"
                                    error={
                                        touched.item_name &&
                                        Boolean(errors.item_name)
                                    }
                                    helperText={
                                        touched.item_name &&
                                        errors.item_name
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Menu Item Chinese Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.item_chinese_name}
                                    name="item_chinese_name"
                                    error={
                                        touched.item_chinese_name &&
                                        Boolean(errors.item_chinese_name)
                                    }
                                    helperText={
                                        touched.item_chinese_name &&
                                        errors.item_chinese_name
                                    }
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Autocomplete
                                    options={categoryData}
                                    getOptionLabel={(option) =>
                                        option.label
                                    }
                                    value={
                                        categoryData.find(
                                            (option) =>
                                                option.value === values.cat_id
                                        ) || null
                                    }
                                    onChange={(_, newValue) => {
                                        setFieldValue(
                                            "cat_id",
                                            newValue
                                                ? newValue.value
                                                : ""
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Course"
                                            variant="filled"
                                            error={
                                                touched.cat_id &&
                                                Boolean(errors.cat_id)
                                            }
                                            helperText={
                                                touched.cat_id &&
                                                errors.cat_id
                                            }
                                        />
                                    )}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Box sx={{ gridColumn: "span 4" }}>
                                    <input
                                        accept="image/jpeg, image/png, image/jpg, image/gif"
                                        style={{ display: "none" }}
                                        id="item-image-upload"
                                        name="item_image"
                                        type="file"
                                        onChange={(event) => {
                                            const file =
                                                event.currentTarget.files[0];

                                            if (file) {
                                                setFieldValue(
                                                    "item_image",
                                                    file
                                                );

                                                setFieldValue(
                                                    "item_image_preview",
                                                    URL.createObjectURL(file)
                                                );

                                                setFieldValue(
                                                    "item_image_removed",
                                                    false
                                                );
                                            }

                                            event.target.value = "";
                                        }}
                                    />

                                    <label htmlFor="item-image-upload">
                                        <Button
                                            variant="contained"
                                            component="span"
                                        >
                                            Upload Image
                                        </Button>
                                    </label>

                                    <Box mt={2}>
                                        {((values.item_image &&
                                            values.item_image instanceof
                                            File) ||
                                            (values.item_image &&
                                                typeof values.item_image ===
                                                "string")) &&
                                            !values.item_image_removed && (
                                                <>
                                                    <img
                                                        src={
                                                            values.item_image_preview ||
                                                            (values.item_image instanceof
                                                                File
                                                                ? URL.createObjectURL(
                                                                    values.item_image
                                                                )
                                                                : values.item_image)
                                                        }
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: 200,
                                                            maxHeight: 200,
                                                            display: "block",
                                                            marginBottom: 8,
                                                        }}
                                                    />

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => {
                                                            setFieldValue(
                                                                "item_image",
                                                                null
                                                            );

                                                            setFieldValue(
                                                                "item_image_preview",
                                                                null
                                                            );

                                                            setFieldValue(
                                                                "item_image_removed",
                                                                true
                                                            );

                                                            const fileInput =
                                                                document.getElementById(
                                                                    "item-image-upload"
                                                                );

                                                            if (fileInput) {
                                                                fileInput.value = "";
                                                            }
                                                        }}
                                                    >
                                                        Remove Image
                                                    </Button>
                                                </>
                                            )}
                                    </Box>
                                </Box>

                                <Autocomplete
                                    multiple
                                    options={optionData}
                                    getOptionLabel={(option) =>
                                        option.label
                                    }
                                    value={optionData.filter((option) =>
                                        values.options.includes(
                                            String(option.value)
                                        )
                                    )}
                                    onChange={(_, newValue) => {
                                        const selectedValues =
                                            newValue.map((item) =>
                                                String(item.value)
                                            );

                                        setFieldValue(
                                            "options",
                                            selectedValues
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Options"
                                            variant="filled"
                                            error={
                                                touched.options &&
                                                Boolean(errors.options)
                                            }
                                            helperText={
                                                touched.options &&
                                                errors.options
                                            }
                                        />
                                    )}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Autocomplete
                                    multiple
                                    options={preferencesData}
                                    getOptionLabel={(option) =>
                                        option.label
                                    }
                                    value={preferencesData.filter(
                                        (option) =>
                                            values.preference.includes(
                                                option.value
                                            )
                                    )}
                                    onChange={(_, newValue) => {
                                        const selectedIds =
                                            newValue.map(
                                                (item) => item.value
                                            );

                                        setFieldValue(
                                            "preference",
                                            selectedIds
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Preference"
                                            variant="filled"
                                            error={
                                                touched.preference &&
                                                Boolean(errors.preference)
                                            }
                                            helperText={
                                                touched.preference &&
                                                errors.preference
                                            }
                                        />
                                    )}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="end"
                                mt="20px"
                            >
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                >
                                    Save Menu Item Details
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            )}
        </Box>
    );
};

export default ItemDetailsForm;
