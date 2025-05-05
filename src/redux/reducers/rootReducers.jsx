// src/reducers/rootReducer.js
import { combineReducers } from 'redux';
import { itemReducer } from './itemsReducers';

export const rootReducer = combineReducers({
  itemState: itemReducer,
});
