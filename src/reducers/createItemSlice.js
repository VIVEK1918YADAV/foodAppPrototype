import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  calories: "",
  price: "",
  category: null,
  imageAsset: null,
  fields: false,
  alertStatus: "danger",
  msg: null,
  isLoading: false,
};

const newItemSlice = createSlice({
  name: "newItem",
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setCalories: (state, action) => {
      state.calories = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setImageAsset: (state, action) => {
      state.imageAsset = action.payload;
    },
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setAlertStatus: (state, action) => {
      state.alertStatus = action.payload;
    },
    setMsg: (state, action) => {
      state.msg = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default newItemSlice.reducer;
export const {
  setTitle,
  setCategory,
  setCalories,
  setPrice,
  setImageAsset,
  setFields,
  setAlertStatus,
  setMsg,
  setIsLoading,
} = newItemSlice.actions;
