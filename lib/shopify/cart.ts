import { shopifyFetch, gql } from "./client";
import type { Cart } from "./types";

/* ------------------------------------------------------------------ */
/*  Shared cart fragment                                              */
/* ------------------------------------------------------------------ */

const CART_FRAGMENT = gql`
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            amountPerQuantity {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
              product {
                title
                handle
              }
            }
          }
        }
        cursor
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Mutations & queries                                               */
/* ------------------------------------------------------------------ */

const CREATE_CART = gql`
  mutation CreateCart {
    cartCreate {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART = gql`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART_LINES = gql`
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_CART_LINES = gql`
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const GET_CART = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

/* ------------------------------------------------------------------ */
/*  Response types                                                    */
/* ------------------------------------------------------------------ */

interface UserError {
  field: string[];
  message: string;
}

interface CartMutationResponse<K extends string> {
  [key: string]: {
    cart: Cart | null;
    userErrors: UserError[];
  };
}

interface CreateCartResponse {
  cartCreate: { cart: Cart | null; userErrors: UserError[] };
}

interface AddToCartResponse {
  cartLinesAdd: { cart: Cart | null; userErrors: UserError[] };
}

interface UpdateCartLinesResponse {
  cartLinesUpdate: { cart: Cart | null; userErrors: UserError[] };
}

interface RemoveCartLinesResponse {
  cartLinesRemove: { cart: Cart | null; userErrors: UserError[] };
}

interface GetCartResponse {
  cart: Cart | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function extractCart<T extends { userErrors: UserError[]; cart: Cart | null }>(
  result: T,
  operationName: string,
): Cart {
  if (result.userErrors.length > 0) {
    const messages = result.userErrors
      .map((e) => `${e.field.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`Shopify ${operationName} error:\n${messages}`);
  }

  if (!result.cart) {
    throw new Error(
      `Shopify ${operationName} returned no cart. The cart may have expired.`,
    );
  }

  return result.cart;
}

/* ------------------------------------------------------------------ */
/*  Exported functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Create a new empty cart.
 */
export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<CreateCartResponse>(CREATE_CART);
  return extractCart(data.cartCreate, "cartCreate");
}

/**
 * Add a product variant to an existing cart.
 * @param cartId    - The cart ID
 * @param variantId - The product variant's Storefront API ID
 * @param quantity  - Number of items to add
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<AddToCartResponse>(ADD_TO_CART, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return extractCart(data.cartLinesAdd, "cartLinesAdd");
}

/**
 * Update the quantity of a cart line.
 * Setting quantity to 0 effectively removes the line.
 * @param cartId - The cart ID
 * @param lineId - The cart line ID to update
 * @param quantity - New quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetch<UpdateCartLinesResponse>(UPDATE_CART_LINES, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return extractCart(data.cartLinesUpdate, "cartLinesUpdate");
}

/**
 * Remove one or more lines from a cart.
 * @param cartId  - The cart ID
 * @param lineIds - Array of cart line IDs to remove
 */
export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<RemoveCartLinesResponse>(REMOVE_CART_LINES, {
    cartId,
    lineIds,
  });
  return extractCart(data.cartLinesRemove, "cartLinesRemove");
}

/**
 * Fetch an existing cart by its ID.
 * @returns The cart, or `null` if the ID is invalid or the cart has expired.
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<GetCartResponse>(GET_CART, { cartId });
  return data.cart ?? null;
}
