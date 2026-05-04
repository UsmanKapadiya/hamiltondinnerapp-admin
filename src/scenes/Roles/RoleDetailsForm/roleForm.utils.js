export const groupPermissionsByModule = (permissions) => {
  const groups = {};

  permissions.forEach((perm) => {
    const match = perm.name.match(/_(.+)$/);
    let module = match ? match[1] : "Other";

    if (["Form", "Forms"].includes(module)) module = "Form";
    else if (module === "FormDetails") module = "FormDetails";
    else if (
      ["Room", "Category", "Item", "Menus", "Settings", "Roles", "Users", "Order"].includes(module)
    ) {
      module += "Details";
    }

    if (module === "Options") module = "ItemOptions";
    if (module === "Preference") module = "ItemPreference";

    if (!groups[module]) groups[module] = [];
    groups[module].push(perm);
  });

  return groups;
};

export const MODULE_ORDER = [
  "Admin",
  "MenusDetails",
  "ItemDetails",
  "ItemOptions",
  "ItemPreference",
  "CategoryDetails",
  "RoomDetails",
  "OrderDetails",
  "UsersDetails",
  "RolesDetails",
  "Form",
  "SettingsDetails",
];

export const getModuleLabel = (module) => {
  const map = {
    RoomDetails: "Resident Details",
    ItemDetails: "Menu Item Details",
    ItemOptions: "Menu Item Options",
    ItemPreference: "Menu Item Preferences",
    MenusDetails: "Menu Details",
    SettingsDetails: "Settings",
    RolesDetails: "Roles",
    UsersDetails: "Users",
    Form: "Form Types",
    CategoryDetails: "Course Details",
    OrderDetails: "Order Details",
    Admin: "Admin Panel",
  };

  return (
    map[module] ||
    module.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  );
};
