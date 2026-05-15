import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { useLocation } from "react-router-dom";
import CategoryServices from "../../../services/categoryServices";

const useCategoryDetailsView = () => {
    const location = useLocation();
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const categoryId = location.state?.id;
    const categoryListData = location.state?.categoryListData || [];

    const getCategoryDetails =
        useCallback(async (id) => {
            if (!id) return;

            setLoading(true);

            try {
                const response = await CategoryServices.getCategoryDetails(id);

                setCategoryDetails(
                    response?.data || null
                );
            } catch (error) {
                console.error(
                    "Error fetching Course details:",
                    error
                );

                setCategoryDetails(null);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        getCategoryDetails(categoryId);
    }, [
        categoryId,
        getCategoryDetails,
    ]);

    return {
        categoryDetails,
        categoryListData,
        loading,
    };
};

export default useCategoryDetailsView;
