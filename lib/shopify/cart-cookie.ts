import { cookies } from "next/headers";

const CART_COOKIE = "cartId";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Read the cart ID from the request cookie.
 * Returns `undefined` if no cart cookie exists.
 */
export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value;
}

/**
 * Set the cart ID cookie so it persists across requests.
 * HttpOnly, SameSite=Lax, path="/", max-age 30 days.
 */
export async function setCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}
