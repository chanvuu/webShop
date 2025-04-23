// src/app/state/cart/cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cart_item';

export const AddToCart = createAction(
  '[Cart] Add to Cart',
  props<{ cartItem: CartItem }>()
);

export const RemoveFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ productId: number }>()
);

export const UpdateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number, quantity: number }>()
);

export const ClearCart = createAction(
  '[Cart] Clear Cart'
);