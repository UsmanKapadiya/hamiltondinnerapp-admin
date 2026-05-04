import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SettingServices from "../../services/settingServices";
import { hasPermission } from "../../components/permissions";

const DEFAULT_VALUES = {
  breakfast_guideline: "",
  breakfast_guideline_cn: "",
  lunch_guideline: "",
  lunch_guideline_cn: "",
  dinner_guideline: "",
  dinner_guideline_cn: "",
};

const useSetting = () => {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState([]);
  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);

  const permissionList = useSelector(
    (state) => state?.permissionState?.permissionsList
  );

  //  Permissions
  const permissions = useMemo(
    () => ({
      canAdd: hasPermission(permissionList, "add_Settings"),
      canEdit: hasPermission(permissionList, "edit_Settings"),
      canDelete: hasPermission(permissionList, "delete_Settings"),
      canBrowse: hasPermission(permissionList, "browse_Settings"),
    }),
    [permissionList]
  );

  //  Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SettingServices.getSettings();
      const data = response?.data || [];

      setSetting(data);

      const getValue = (key) =>
        data.find((item) => item.key === key)?.value || "";

      setInitialValues({
        breakfast_guideline: getValue("site.app_breakfast_msg"),
        breakfast_guideline_cn: getValue("site.app_breakfast_msg_cn"),
        lunch_guideline: getValue("site.app_lunch_msg"),
        lunch_guideline_cn: getValue("site.app_lunch_msg_cn"),
        dinner_guideline: getValue("site.app_dinner_msg"),
        dinner_guideline_cn: getValue("site.app_dinner_msg_cn"),
      });
    } catch (error) {
      toast.error("Failed to fetch settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  //  Submit
  const handleSubmit = async (values) => {
    setLoading(true);

    const mapPayload = (key, value) => {
      const found = setting.find((item) => item.key === key);
      return found ? { ...found, value } : null;
    };

    const payload = [
      mapPayload("site.app_breakfast_msg", values.breakfast_guideline),
      mapPayload("site.app_breakfast_msg_cn", values.breakfast_guideline_cn),
      mapPayload("site.app_lunch_msg", values.lunch_guideline),
      mapPayload("site.app_lunch_msg_cn", values.lunch_guideline_cn),
      mapPayload("site.app_dinner_msg", values.dinner_guideline),
      mapPayload("site.app_dinner_msg_cn", values.dinner_guideline_cn),
    ].filter(Boolean);

    try {
      if (!payload.length) {
        toast.error("No settings to update.");
        return;
      }

      await SettingServices.updateSettings(payload);
      toast.success("Settings updated successfully!");
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(toast.error);
      } else {
        toast.error("Update failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    initialValues,
    handleSubmit,
    permissions,
  };
};

export default useSetting;
