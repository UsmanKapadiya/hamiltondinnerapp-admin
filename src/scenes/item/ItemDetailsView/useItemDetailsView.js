import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ItemServices from "../../../services/itemServices";

const useItemDetailsView = () => {
    const location = useLocation();
    const categoryListData = location.state?.categoryListData || [];
    const optionsListData = location.state?.optionsList || [];
    const preferencesListData = location.state?.preferencesList || [];
    const [loading, setLoading] = useState(false);
    const [itemDetails, setItemDetails] = useState(null);

    const getItemsDetails = useCallback(async (id) => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await ItemServices.getItemsDetails(id);
            setItemDetails(response?.data || {});
        } catch (error) {
            setItemDetails({});
            console.error("Error fetching item details:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getItemsDetails(location.state?.id);
    }, [location.state, getItemsDetails]);

    const courseName = useMemo(() => {
        const typeId = itemDetails?.cat_id;
        const typeObj = categoryListData.find((t) => t.id === typeId);
        return typeObj ? typeObj.cat_name : "";
    }, [itemDetails, categoryListData]);

    const optionNames = useMemo(() => {
        if (!itemDetails?.options) return "";
        try {
            const optionIds = JSON.parse(itemDetails.options);

            const names = optionIds
                .map((id) => {
                    const option = optionsListData.find(
                        (opt) => opt.id === parseInt(id)
                    );

                    return option
                        ? option.option_name
                        : null;
                })
                .filter(Boolean);

            return names.length > 0
                ? names.join(", ")
                : "";
        } catch {
            return "";
        }
    }, [itemDetails, optionsListData]);

    const preferenceNames = useMemo(() => {
        if (!itemDetails?.preference) return "";

        try {
            const prefIds = JSON.parse(
                itemDetails.preference
            );

            const names = prefIds
                .map((id) => {
                    const pref =
                        preferencesListData.find(
                            (p) => p.id === parseInt(id)
                        );

                    return pref ? pref.pname : null;
                })
                .filter(Boolean);

            return names.length > 0
                ? names.join(", ")
                : "";
        } catch {
            return "";
        }
    }, [itemDetails, preferencesListData]);

    return {
        loading,
        itemDetails,
        courseName,
        optionNames,
        preferenceNames,
    };
};

export default useItemDetailsView;
