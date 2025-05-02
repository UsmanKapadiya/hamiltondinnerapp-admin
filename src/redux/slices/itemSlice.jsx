import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    itemList: [], // Initial state for itemList
  },
  reducers: {
    setItemList: (state, action) => {
      state.itemList = action.payload; // Update itemList with the payload
    },
  },
});

export const { setItemList } = itemSlice.actions; // Export the action
export default itemSlice.reducer; // Export the reducer