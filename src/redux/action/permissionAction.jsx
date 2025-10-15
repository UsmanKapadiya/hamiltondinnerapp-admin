// Action types
export const SET_PERMISSION_LIST = "SET_PERMISSION_LIST";

// Action creators
export const setPermissionList = (data) => ({
  type: SET_PERMISSION_LIST,
  payload: data,
});