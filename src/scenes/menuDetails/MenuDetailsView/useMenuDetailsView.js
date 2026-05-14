import {
    useEffect,
    useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const useMenuDetailsView = () => {
    const location = useLocation();
    const itemList = useSelector((state) => state.itemState.item);
    const [loading, setLoading] = useState(true);
    const [menuDetails, setMenuDetails] = useState(null);

    useEffect(() => {
        if (location.state) {
            setMenuDetails(
                location.state
            );
        }

        setLoading(false);
    }, [location.state]);

    return {
        loading,
        menuDetails,
        itemList,
    };
};

export default useMenuDetailsView;
