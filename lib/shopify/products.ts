import { shopifyFetch, gql } from "./client";
import type { Product, Collection, Connection } from "./types";

/* ------------------------------------------------------------------ */
/*  Shared GraphQL fragments                                          */
/* ------------------------------------------------------------------ */

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
        cursor
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
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
        }
        cursor
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Queries                                                           */
/* ------------------------------------------------------------------ */

const GET_PRODUCTS = gql`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
        cursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
          products(first: 0) {
            edges {
              node {
                id
              }
              cursor
            }
          }
        }
        cursor
      }
    }
  }
`;

const GET_COLLECTION_PRODUCTS = gql`
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/* ------------------------------------------------------------------ */
/*  Response types (narrow wrappers around the GraphQL responses)     */
/* ------------------------------------------------------------------ */

interface GetProductsResponse {
  products: Connection<Product>;
}

interface GetProductByHandleResponse {
  productByHandle: Product | null;
}

interface GetCollectionsResponse {
  collections: Connection<Collection>;
}

interface GetCollectionProductsResponse {
  collectionByHandle: Collection | null;
}

/* ------------------------------------------------------------------ */
/*  Exported functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetch a list of products.
 * @param first - Number of products to fetch (default 20, max 250)
 */
export async function getProducts(first: number = 20): Promise<Product[]> {
  const data = await shopifyFetch<GetProductsResponse>(GET_PRODUCTS, {
    first,
  });
  return data.products.edges.map((edge) => edge.node);
}

/**
 * Fetch a single product by its URL handle.
 * @returns The product, or `null` if no product matches the handle.
 */
export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const data = await shopifyFetch<GetProductByHandleResponse>(
    GET_PRODUCT_BY_HANDLE,
    { handle },
  );
  return data.productByHandle ?? null;
}

/**
 * Fetch all collections (without their products).
 * @param first - Number of collections to fetch (default 20)
 */
export async function getCollections(
  first: number = 20,
): Promise<Collection[]> {
  const data = await shopifyFetch<GetCollectionsResponse>(GET_COLLECTIONS, {
    first,
  });
  return data.collections.edges.map((edge) => edge.node);
}

/**
 * Fetch products within a specific collection by its handle.
 * @param handle - The collection's URL handle
 * @param first  - Number of products to fetch (default 20)
 * @returns Array of products, or empty array if collection not found.
 */
export async function getCollectionProducts(
  handle: string,
  first: number = 20,
): Promise<Product[]> {
  const data = await shopifyFetch<GetCollectionProductsResponse>(
    GET_COLLECTION_PRODUCTS,
    { handle, first },
  );

  if (!data.collectionByHandle) {
    return [];
  }

  return data.collectionByHandle.products.edges.map((edge) => edge.node);
}
