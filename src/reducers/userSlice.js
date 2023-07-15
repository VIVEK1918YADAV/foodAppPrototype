import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  foodItems: null,
  isMenuOpen: false,
  cart: { isOpen: false, cartItems: [] },
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setFoodItems: (state, action) => {
      state.foodItems = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setCartIsOpen: (state, action) => {
      state.cart.isOpen = action.payload;
    },
    setCartItems: (state, action) => {
      state.cart.cartItems = action.payload;
    },
  },
});

export default userSlice.reducer;
export const {
  setUserInfo,
  setIsMenuOpen,
  setFoodItems,
  setCartIsOpen,
  setCartItems,
} = userSlice.actions;
