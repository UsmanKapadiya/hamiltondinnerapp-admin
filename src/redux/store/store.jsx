import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as the default storage
import { thunk } from "redux-thunk"; // Use named import for redux-thunk
import { rootReducer } from "../reducers/rootReducers";

// Configure persist settings
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Use localStorage
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create the persistor
export const persistor = persistStore(store);

export default store;