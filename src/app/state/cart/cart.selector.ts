// cart.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartCount = createSelector(
  selectCartState,
  (state: CartState) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
);


export const selectCartTotal = createSelector(
  selectCartState,
  (state: CartState) =>
    parseFloat(
      state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    )
);
