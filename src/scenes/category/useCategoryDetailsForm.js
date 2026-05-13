import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import CategoryServices from "../../services/categoryServices";

const useCategoryDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredParentOptions, setFilteredParentOptions] = useState([]);
  
  const categoryListData = location.state?.categoryListData || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchedDetails = location.state?.selectedCategory;
      setCategoryDetails(fetchedDetails);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    if (categoryDetails?.type) {
      const filteredOptions = _.chain(categoryListData)
        .filter((category) =>
          category.type === categoryDetails.type &&
          category.id !== categoryDetails.id
        )
        .map((category) => ({
          label: category.cat_name,
          value: category.id,
          type: category.type,
        }))
        .value();
      setFilteredParentOptions(filteredOptions);
    }
  }, [categoryDetails?.type, categoryDetails?.id, categoryListData]);

  const initialValues = useMemo(() => ({
    id: categoryDetails?.id || "",
    cat_name: categoryDetails?.cat_name || "",
    category_chinese_name: categoryDetails?.category_chinese_name || "",
    type: categoryDetails?.type || "",
    parent_id: categoryDetails?.parent_id || "",
  }), [categoryDetails]);

  const handleFormSubmit = useCallback(async (values, actions) => {
    setLoading(true);
    try {
      let response;
      if (values.id) {
        response = await CategoryServices.updateCategoryDetails(values.id, values);
        toast.success("Course updated successfully!");
      } else {
        response = await CategoryServices.createCategoryDetails(values);
        toast.success("Course created successfully!");
      }
      setCategoryDetails(response?.data);
      actions.resetForm({ values: { ...response?.data } });
      if (response?.success === true) {
        navigate("/category-details");
      }
    } catch (error) {
      toast.error("Failed to process Course. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleTypeChange = useCallback((selectedType, values, setFieldValue, handleChange, e) => {
    handleChange(e);
    setFieldValue("type", selectedType);

    const filteredOptions = _.chain(categoryListData)
      .filter((category) =>
        String(category.type) === selectedType &&
        category.id !== values.id &&
        category?.parent_id === 0
      )
      .map((category) => ({
        label: category.cat_name,
        value: category.id,
        type: category.type,
      }))
      .value();

    setFilteredParentOptions(filteredOptions);
    setFieldValue("parent_id", "");
  }, [categoryListData]);

  return {
    categoryDetails,
    loading,
    filteredParentOptions,
    initialValues,
    handleFormSubmit,
    handleTypeChange,
    categoryListData,
  };
};

export default useCategoryDetailsForm;
