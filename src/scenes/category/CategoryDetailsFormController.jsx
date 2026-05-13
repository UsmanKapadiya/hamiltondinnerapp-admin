import useCategoryDetailsForm from "./useCategoryDetailsForm";
import CategoryDetailsFormView from "./CategoryDetailsFormView";

const CategoryDetailsFormController = () => {
  const formState = useCategoryDetailsForm();

  return <CategoryDetailsFormView {...formState} />;
};

export default CategoryDetailsFormController;
