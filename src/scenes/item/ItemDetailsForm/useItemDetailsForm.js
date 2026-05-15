import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import ItemServices from "../../../services/itemServices";

const validationSchema = yup.object().shape({
    item_name: yup
        .string()
        .required("Menu Item Name is required"),

    options: yup
        .array()
        .of(
            yup.string().required(
                "Each option must be a string"
            )
        )
        .test(
            "min-if-present",
            "At least 2 options are required",
            (value) => {
                if (!value || value.length === 0) {
                    return true;
                }

                return value.length >= 2;
            }
        ),

    cat_id: yup
        .number()
        .typeError("Course must be a number")
        .required("Course is required"),
});

const useItemDetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [itemDetails, setItemDetails] = useState();
    const categoryListData = location.state?.categoryListData || [];
    const optionsListData = location.state?.optionsList || [];
    const preferencesListData = location.state?.preferencesList || [];

    const categoryData = useMemo(
        () =>
            categoryListData.map((category) => ({
                label: category.cat_name,
                value: category.id,
            })),
        [categoryListData]
    );

    const optionData = useMemo(
        () =>
            optionsListData.map((opt) => ({
                label: opt.option_name,
                value: opt.id,
            })),
        [optionsListData]
    );

    const preferencesData = useMemo(
        () =>
            preferencesListData.map((pref) => ({
                label: pref.pname,
                value: String(pref.id),
                ...pref,
            })),
        [preferencesListData]
    );

    useEffect(() => {
        const fetchedItemDetails = location.state?.selectedRow;
        setItemDetails(fetchedItemDetails);
        setLoading(false);
    }, [location.state]);

    const getInitialValues = () => ({
        id: itemDetails?.id || "",
        item_name: itemDetails?.item_name || "",
        item_chinese_name: itemDetails?.item_chinese_name || "",
        cat_id: itemDetails?.cat_id,
        options: (() => {
            try {
                return itemDetails?.options
                    ? JSON.parse(
                        itemDetails.options
                    ).map(String)
                    : [];
            } catch {
                return [];
            }
        })(),
        preference: (() => {
            try {
                return itemDetails?.preference
                    ? JSON.parse(
                        itemDetails.preference
                    ).map(String)
                    : [];
            } catch {
                return [];
            }
        })(),
        item_image: itemDetails?.item_image
            ? itemDetails?.item_image
            : null,
        item_image_preview: null,
        item_image_removed: false,
    });

    const handleFormSubmit = async (
        values,
        { resetForm }
    ) => {
        setLoading(true);

        const formData = new FormData();

        formData.append(
            "item_name",
            values.item_name
        );

        formData.append(
            "item_chinese_name",
            values.item_chinese_name
        );

        formData.append(
            "cat_id",
            values.cat_id
        );

        formData.append(
            "options",
            JSON.stringify(values.options)
        );

        formData.append(
            "preference",
            JSON.stringify(values.preference)
        );

        if (
            values.item_image &&
            values.item_image instanceof File &&
            [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ].includes(values.item_image.type)
        ) {
            formData.append(
                "item_image",
                values.item_image
            );
        }

        if (values.item_image_removed) {
            formData.append("item_image", "");
        }

        if (values.id) {
            formData.append("id", values.id);
        }

        try {
            let response;

            if (values.id) {
                response =
                    await ItemServices.updatetItems(
                        values.id,
                        formData
                    );

                setItemDetails(response.data);

                toast.success(
                    "Menu Items updated successfully!"
                );
            } else {
                response =
                    await ItemServices.createItems(
                        formData
                    );

                setItemDetails(
                    response.data || null
                );

                toast.success(
                    "Menu Items created successfully!"
                );

                resetForm();
            }

            navigate("/menu-item-details");
        } catch (error) {
            console.error(
                "Error processing menu items:",
                error
            );

            toast.error(
                "Failed to process menu items. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        itemDetails,
        validationSchema,
        categoryData,
        optionData,
        preferencesData,
        getInitialValues,
        handleFormSubmit,
    };
};

export default useItemDetailsForm;
