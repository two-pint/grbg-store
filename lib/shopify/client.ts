import "server-only";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  type DocumentNode,
  type TypedDocumentNode,
} from "@apollo/client/index.js";
import { storefrontApiUrl, storefrontAccessToken } from "./config";

const client = new ApolloClient({
  link: new HttpLink({
    uri: storefrontApiUrl,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

/**
 * Execute a GraphQL query against the Shopify Storefront API.
 *
 * Server-only — this module cannot be imported from client components.
 *
 * @param query  - A GraphQL DocumentNode (use gql`` tagged template)
 * @param variables - Optional variables for the query
 * @returns The typed `data` from the response
 * @throws On network errors or GraphQL errors
 */
export async function shopifyFetch<
  TData = Record<string, unknown>,
  TVars extends Record<string, unknown> = Record<string, unknown>,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVars>,
  variables?: TVars,
): Promise<TData> {
  const result = await client.query<TData>({
    query,
    variables: variables ?? undefined,
  });

  if (result.error) {
    throw new Error(
      `Shopify Storefront API error:\n${result.error.message}`,
    );
  }

  if (!result.data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return result.data;
}

export { gql } from "@apollo/client/index.js";
