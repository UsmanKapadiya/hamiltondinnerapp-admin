import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmpty, get } from "lodash";
import AuthServices from "../../services/authServices";

const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await AuthServices.login(formData);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        const { access_token, user } = response;
        
        if (get(response, "permissions.browse_Admin") === 1) {
          localStorage.setItem("authToken", access_token);
          localStorage.setItem("userData", JSON.stringify(user));
          toast.success("Login Successfully!");
          
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.warning("You don't have permission to access Admin Panel");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error processing login:", error);
      const errorMessage =
        get(error, "response.data.error") || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);

      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
