// src/reducers/itemReducer.js
const initialState = {
    permissionsList: [],
  };
  
  export const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_PERMISSION_LIST':
        // console.log("SET_PERMISSION_LIST",action.payload)
        return { ...state, permissionsList: action.payload };
      default:
        return state;
    }
  };
  