// cart.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../models/cart_item';
import { AddToCart, RemoveFromCart, UpdateQuantity } from './cart.actions';

export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: []
};
  
export const cartReducer = createReducer(
  initialState,
  on(AddToCart, (state, { cartItem }) => {
    const existingItem = state.items.find(item => item.id === cartItem.id);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        )
      };
    } else {
      return {
        ...state,
        items: [...state.items, { ...cartItem }]
      };
    }
  }),
  on(RemoveFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.id !== productId)
  })),
  on(UpdateQuantity, (state, { productId, quantity }) => ({
    ...state,
    items: state.items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    )
  }))
);
