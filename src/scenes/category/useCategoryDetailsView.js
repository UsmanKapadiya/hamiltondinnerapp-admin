import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import CategoryServices from "../../services/categoryServices";
import { type } from "../../data/mockData";

const useCategoryDetailsView = () => {
  const location = useLocation();
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const categoryId = location.state?.id;
  const categoryListData = location.state?.categoryListData || [];

  const getCategoryDetails = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await CategoryServices.getCategoryDetails(id);
      setCategoryDetails(response?.data || null);
    } catch (error) {
      setCategoryDetails(null);
      console.error("Error fetching Course details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategoryDetails(categoryId);
  }, [categoryId, getCategoryDetails]);

  const getTypeName = useCallback((typeId) => {
    const typeObj = _.find(type, { id: typeId });
    return typeObj ? typeObj.type_name : "N/A";
  }, []);

  const getParentName = useCallback((parentId) => {
    const parentObj = _.find(categoryListData, { id: parentId });
    return parentObj ? parentObj.cat_name : "";
  }, [categoryListData]);

  return {
    categoryDetails,
    loading,
    getTypeName,
    getParentName,
  };
};

export default useCategoryDetailsView;
