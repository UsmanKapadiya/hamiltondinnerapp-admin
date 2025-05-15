export function hasPermission(permissionList, permissionName) {
  if (!Array.isArray(permissionList)) return false;
  return permissionList.some(p => p.name === permissionName);
}