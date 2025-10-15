// Action types
export const SET_ITEM_LIST = "SET_ITEM_LIST";

// Action creators
export const setItemList = (data) => ({
  type: SET_ITEM_LIST,
  payload: data,
});