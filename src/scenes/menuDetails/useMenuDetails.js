import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import CategoryServices from "../../services/categoryServices";
import MenuServices from "../../services/menuServices";

const useMenuDetails = (optionsDetails) => {
  const navigate = useNavigate();
  const itemList = useSelector((state) => state.itemState.item);
  
  const [loading, setLoading] = useState(false);
  const [categoryListData, setCategoryListData] = useState([]);
  
  // Breakfast state
  const [selected, setSelected] = useState("");
  const [selectedItems, setSelectedItems] = useState(_.get(optionsDetails, "items.breakfast", []));
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Lunch state
  const [selectedLunch, setSelectedLunch] = useState("");
  const [selectedLunchItems, setSelectedLunchItems] = useState(_.get(optionsDetails, "items.lunch", []));
  const [lunchSearchTerm, setLunchSearchTerm] = useState("");
  const [debouncedLunchSearchTerm, setDebouncedLunchSearchTerm] = useState("");
  
  // Dinner state
  const [selectedDinner, setSelectedDinner] = useState("");
  const [selectedDinnerItems, setSelectedDinnerItems] = useState(_.get(optionsDetails, "items.dinner", []));
  const [dinnerSearchTerm, setDinnerSearchTerm] = useState("");
  const [debouncedDinnerSearchTerm, setDebouncedDinnerSearchTerm] = useState("");

  // Memoized category options
  const breakfastOptions = useMemo(
    () => _.filter(categoryListData, (category) => category.type === 1),
    [categoryListData]
  );
  
  const lunchOptions = useMemo(
    () => _.filter(categoryListData, (category) => category.type === 2),
    [categoryListData]
  );
  
  const dinnerOptions = useMemo(
    () => _.filter(categoryListData, (category) => category.type === 3),
    [categoryListData]
  );

  // Memoized categorized items
  const categorizedItems = useMemo(() => {
    return _.reduce(
      categoryListData,
      (acc, category) => {
        acc[category.cat_name] = _.filter(
          itemList,
          (item) => item.cat_id === category.id
        );
        return acc;
      },
      {}
    );
  }, [categoryListData, itemList]);

  // Debounce search terms for performance
  useEffect(() => {
    const handler = _.debounce(() => setDebouncedSearchTerm(searchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  useEffect(() => {
    const handler = _.debounce(() => setDebouncedLunchSearchTerm(lunchSearchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [lunchSearchTerm]);

  useEffect(() => {
    const handler = _.debounce(() => setDebouncedDinnerSearchTerm(dinnerSearchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [dinnerSearchTerm]);

  // Fetch categories once
  useEffect(() => {
    const getCategoryListData = async () => {
      try {
        const response = await CategoryServices.getCategoryList();
        setCategoryListData(_.get(response, "data", []));
      } catch (error) {
        console.error("Error fetching category list:", error);
        toast.error("Failed to fetch categories");
      }
    };
    getCategoryListData();
  }, []);

  // Set default selected categories
  useEffect(() => {
    if (categoryListData.length > 0) {
      if (breakfastOptions.length > 0 && !selected) {
        setSelected(_.get(breakfastOptions, "[0].cat_name", ""));
      }
      if (lunchOptions.length > 0 && !selectedLunch) {
        setSelectedLunch(_.get(lunchOptions, "[0].cat_name", ""));
      }
      if (dinnerOptions.length > 0 && !selectedDinner) {
        setSelectedDinner(_.get(dinnerOptions, "[0].cat_name", ""));
      }
    }
  }, [categoryListData, breakfastOptions, lunchOptions, dinnerOptions, selected, selectedLunch, selectedDinner]);

  // Memoized filtered data
  const filteredBreakfastData = useMemo(() => {
    const renderData = _.get(categorizedItems, selected, []);
    return _.filter(renderData, (item) =>
      _.includes(
        _.toLower(_.get(item, "item_name", "")),
        _.toLower(debouncedSearchTerm)
      )
    );
  }, [categorizedItems, selected, debouncedSearchTerm]);

  const filteredLunchData = useMemo(() => {
    const renderLunchData = _.get(categorizedItems, selectedLunch, []);
    return _.filter(renderLunchData, (item) =>
      _.includes(
        _.toLower(_.get(item, "item_name", "")),
        _.toLower(debouncedLunchSearchTerm)
      )
    );
  }, [categorizedItems, selectedLunch, debouncedLunchSearchTerm]);

  const filteredDinnerData = useMemo(() => {
    const renderDinnerData = _.get(categorizedItems, selectedDinner, []);
    return _.filter(renderDinnerData, (item) =>
      _.includes(
        _.toLower(_.get(item, "item_name", "")),
        _.toLower(debouncedDinnerSearchTerm)
      )
    );
  }, [categorizedItems, selectedDinner, debouncedDinnerSearchTerm]);

  // Memoized handlers
  const handleSelectCategory = useCallback((category) => {
    setSelected(category);
    setSearchTerm("");
  }, []);

  const handleSelectLunch = useCallback((category) => {
    setSelectedLunch(category);
    setLunchSearchTerm("");
  }, []);

  const handleSelectDinner = useCallback((category) => {
    setSelectedDinner(category);
    setDinnerSearchTerm("");
  }, []);

  const handleSelectItem = useCallback((item) => {
    setSelectedItems((prev) =>
      _.includes(prev, item.id)
        ? _.filter(prev, (id) => id !== item.id)
        : [...prev, item.id]
    );
  }, []);

  const handleSelectLunchItem = useCallback((item) => {
    setSelectedLunchItems((prev) =>
      _.includes(prev, item.id)
        ? _.filter(prev, (id) => id !== item.id)
        : [...prev, item.id]
    );
  }, []);

  const handleSelectDinnerItem = useCallback((item) => {
    setSelectedDinnerItems((prev) =>
      _.includes(prev, item.id)
        ? _.filter(prev, (id) => id !== item.id)
        : [...prev, item.id]
    );
  }, []);

  // Initial form values
  const initialValues = useMemo(
    () => ({
      id: _.get(optionsDetails, "id"),
      date: _.get(optionsDetails, "date", ""),
      breakfast: _.get(optionsDetails, "items.breakfast.length", 0) > 0,
      lunch: _.get(optionsDetails, "items.lunch.length", 0) > 0,
      dinner: _.get(optionsDetails, "items.dinner.length", 0) > 0,
      BreakfastItems: _.get(optionsDetails, "items.breakfast", []),
      lunchItems: _.get(optionsDetails, "items.lunch", []),
      dinnerItems: _.get(optionsDetails, "items.dinner", []),
    }),
    [optionsDetails]
  );

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (values) => {
      setLoading(true);
      const { BreakfastItems, dinnerItems, lunchItems, breakfast, dinner, lunch, ...restValues } = values;
      
      const formData = {
        ...restValues,
        items: {
          breakfast: selectedItems,
          lunch: selectedLunchItems,
          dinner: selectedDinnerItems,
        },
        is_allday: false,
      };

      try {
        const response = formData?.id
          ? await MenuServices.updateMenus(formData.id, formData)
          : await MenuServices.createMenu(formData);

        if (_.get(response, "success") === true) {
          toast.success(
            formData?.id
              ? "Menu updated successfully!"
              : "Menu created successfully!"
          );
          navigate("/menu-details");
        }
      } catch (error) {
        const errors = _.get(error, "response.data.errors");
        if (errors) {
          _.forEach(_.flatMap(_.values(errors)), (message) => toast.error(message));
        } else {
          toast.error("Failed to process menu. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedItems, selectedLunchItems, selectedDinnerItems, navigate]
  );

  return {
    loading,
    categoryListData,
    breakfastOptions,
    lunchOptions,
    dinnerOptions,
    selected,
    selectedItems,
    searchTerm,
    setSearchTerm,
    selectedLunch,
    selectedLunchItems,
    lunchSearchTerm,
    setLunchSearchTerm,
    selectedDinner,
    selectedDinnerItems,
    dinnerSearchTerm,
    setDinnerSearchTerm,
    filteredBreakfastData,
    filteredLunchData,
    filteredDinnerData,
    handleSelectCategory,
    handleSelectLunch,
    handleSelectDinner,
    handleSelectItem,
    handleSelectLunchItem,
    handleSelectDinnerItem,
    initialValues,
    handleFormSubmit,
  };
};

export default useMenuDetails;
