import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
const storageConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the user slice
};
const persistedReducer = persistReducer(
  storageConfig,
  combineReducers({ user: userReducer })
);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
