import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import * as yup from "yup";

import { toast } from "react-toastify";

import RoomServices from "../../services/roomServices";

const validationSchema = yup.object({
  room_name: yup
    .string()
    .required("Unit Number is required"),

  resident_name: yup
    .string()
    .required("Resident Name is required"),

  occupancy: yup
    .number()
    .typeError("Occupancy must be a number")
    .required("Occupancy is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(
      3,
      "Password must be at least 3 characters"
    ),

  language: yup
    .string()
    .required(
      "Language Preference is required"
    ),

  is_active: yup.boolean(),
});

const useRoomDetailsForm = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setRoomDetails(location.state || {});
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.state]);

  const initialValues = useMemo(
    () => ({
      id: roomDetails?.id || "",

      room_name:
        roomDetails?.room_name || "",

      resident_name:
        roomDetails?.resident_name || "",

      occupancy:
        roomDetails?.occupancy || "1",

      language:
        roomDetails?.language?.toString() ||
        "1",

      password:
        roomDetails?.password || "",

      food_texture:
        roomDetails?.food_texture || "",

      special_instrucations:
        roomDetails?.special_instrucations ||
        "",

      allergy_info:
        roomDetails?.allergy_info || "",

      is_active:
        roomDetails?.is_active === 1 ||
        roomDetails?.is_active === true ||
        roomDetails?.id === undefined,
    }),
    [roomDetails]
  );

  const handleFormSubmit = useCallback(
    async (values, actions) => {
      setLoading(true);

      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      };

      try {
        if (payload.id) {
          await RoomServices.updateRoomDetails(
            payload.id,
            payload
          );

          toast.success(
            "Resident updated successfully!"
          );
        } else {
          await RoomServices.createRoomDetails(
            payload
          );

          toast.success(
            "Resident created successfully!"
          );

          actions.resetForm({
            values: initialValues,
          });
        }

        navigate("/resident-details");
      } catch (error) {
        toast.error(
          "Failed to process resident. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [initialValues, navigate]
  );

  return {
    loading,
    roomDetails,
    showPassword,
    setShowPassword,
    initialValues,
    validationSchema,
    handleFormSubmit,
  };
};

export default useRoomDetailsForm;
