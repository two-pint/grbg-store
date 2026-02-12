import { getCartId } from "@/lib/shopify/cart-cookie";
import { getCart } from "@/lib/shopify/cart";

export default async function CartCount() {
  const cartId = await getCartId();
  let count = 0;

  if (cartId) {
    const cart = await getCart(cartId);
    count = cart?.totalQuantity ?? 0;
  }

  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
