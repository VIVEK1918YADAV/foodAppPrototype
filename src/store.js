import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import newItemReducer from "./reducers/createItemSlice";

const store = configureStore({
  reducer: {
    userData: userReducer,
    newItem: newItemReducer,
  },
});

export default store;
