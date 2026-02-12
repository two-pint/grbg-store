/* ------------------------------------------------------------------ */
/*  Generic Storefront API pagination                                 */
/* ------------------------------------------------------------------ */

export interface Connection<T> {
  edges: Edge<T>[];
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

/* ------------------------------------------------------------------ */
/*  Scalar / shared types                                             */
/* ------------------------------------------------------------------ */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

/* ------------------------------------------------------------------ */
/*  Products                                                          */
/* ------------------------------------------------------------------ */

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image: Image | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  featuredImage: Image | null;
  images: Connection<Image>;
  variants: Connection<ProductVariant>;
  priceRange: PriceRange;
  options: ProductOption[];
  tags: string[];
}

export interface PriceRange {
  minVariantPrice: Money;
  maxVariantPrice: Money;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

/* ------------------------------------------------------------------ */
/*  Collections                                                       */
/* ------------------------------------------------------------------ */

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: Image | null;
  products: Connection<Product>;
}

/* ------------------------------------------------------------------ */
/*  Cart                                                              */
/* ------------------------------------------------------------------ */

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CartCost;
  lines: Connection<CartLine>;
}

export interface CartCost {
  subtotalAmount: Money;
  totalAmount: Money;
  totalTaxAmount: Money | null;
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: CartLineCost;
  merchandise: CartMerchandise;
}

export interface CartLineCost {
  amountPerQuantity: Money;
  totalAmount: Money;
}

export interface CartMerchandise {
  id: string;
  title: string;
  selectedOptions: SelectedOption[];
  image: Image | null;
  product: {
    title: string;
    handle: string;
  };
}
