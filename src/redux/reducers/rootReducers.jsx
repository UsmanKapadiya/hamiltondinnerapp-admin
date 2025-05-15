// src/reducers/rootReducer.js
import { combineReducers } from 'redux';
import { itemReducer } from './itemsReducers';
import { permissionReducer } from './permissionReducers';

export const rootReducer = combineReducers({
  itemState: itemReducer,
  permissionState: permissionReducer,
});
