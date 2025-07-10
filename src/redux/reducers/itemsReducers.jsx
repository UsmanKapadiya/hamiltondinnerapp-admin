// src/reducers/itemReducer.js
const initialState = {
    item: [],
  };
  
  export const itemReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ITEM_LIST':
        // console.log("SET_ITEM_LIST",action.payload)
        return { ...state, item: action.payload };
      default:
        return state;
    }
  };
  