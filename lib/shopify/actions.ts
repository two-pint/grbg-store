"use server";

import { revalidatePath } from "next/cache";
import {
  createCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  getCart,
} from "./cart";
import { getCartId, setCartId } from "./cart-cookie";
import type { Cart } from "./types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/**
 * Resolve a valid cart ID from the cookie.
 * If the cookie is missing or the cart has expired, create a new one.
 */
async function resolveCart(): Promise<Cart> {
  const cartId = await getCartId();

  if (cartId) {
    const existing = await getCart(cartId);
    if (existing) return existing;
  }

  // No cookie or cart expired — create fresh
  const newCart = await createCart();
  await setCartId(newCart.id);
  return newCart;
}

/* ------------------------------------------------------------------ */
/*  Server actions                                                    */
/* ------------------------------------------------------------------ */

/**
 * Add a product variant to the cart.
 * Creates a new cart if none exists or the current one has expired.
 */
export async function addToCartAction(
  variantId: string,
  quantity: number = 1,
): Promise<Cart> {
  const cart = await resolveCart();
  const updatedCart = await addToCart(cart.id, variantId, quantity);

  // Ensure cookie is set (covers newly created carts)
  await setCartId(updatedCart.id);
  revalidatePath("/", "layout");

  return updatedCart;
}

/**
 * Update the quantity of a cart line item.
 */
export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No cart found. Add an item first.");
  }

  const updatedCart = await updateCartLine(cartId, lineId, quantity);
  revalidatePath("/", "layout");

  return updatedCart;
}

/**
 * Remove one or more line items from the cart.
 */
export async function removeFromCartAction(
  lineIds: string[],
): Promise<Cart> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No cart found. Add an item first.");
  }

  const updatedCart = await removeFromCart(cartId, lineIds);
  revalidatePath("/", "layout");

  return updatedCart;
}
