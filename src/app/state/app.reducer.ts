// src/app/state/app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { cartReducer } from './cart/cart.reducer';
import { CartState } from './cart/cart.reducer';

export interface AppState {
  cart: CartState;
}

export const appReducers: ActionReducerMap<AppState> = {
  cart: cartReducer
};
