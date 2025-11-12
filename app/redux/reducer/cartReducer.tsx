import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state: any, action: any) => {
      console.log("log from slice", action.payload);
      const itemInCart = state.cart.find(
        (item: any) => item.id == action.payload.id
      );
      if (itemInCart) {
        console.log("if part worked", itemInCart);
        itemInCart.quantity++;
      } else {
        console.log("else part worked");
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state: any, action: any) => {
      const removeFromCart = state.cart.filter(
        (item: any) => item.id !== action.payload.id
      );
      state.cart = removeFromCart;
    },
    incrementQuantity: (state: any, action: any) => {
      const itemInCart = state.cart.find(
        (item: any) => item.id == action.payload.id
      );
      itemInCart.quantity++;
    },
    decrementQuantity: (state: any, action: any) => {
      console.log("decrement");
      const itemInCart = state.cart.find(
        (item: any) => item.id == action.payload.id
      );
      if (itemInCart.quantity == 1) {
        const removeFromCart = state.cart.filter(
          (item: any) => item.id !== action.payload.id
        );
        state.cart = removeFromCart;
      } else {
        itemInCart.quantity--;
      }
    },
  },
});

export const selectCartItems = (state : any) => state.cart.cart;

export const selectCartTotalQuantity = (state : any) =>
  state.cart.cart.reduce((sum, { quantity }) => sum + quantity, 0);

export const selectCartTotalPrice = (state : any) =>
  state.cart.cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0);

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
