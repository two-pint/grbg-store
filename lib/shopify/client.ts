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
    // Tell Next.js not to cache the underlying HTTP requests
    fetchOptions: { cache: "no-store" as RequestCache },
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
 * Check whether a DocumentNode is a mutation.
 */
function isMutation(doc: DocumentNode): boolean {
  return doc.definitions.some(
    (def) =>
      def.kind === "OperationDefinition" &&
      "operation" in def &&
      def.operation === "mutation",
  );
}

/**
 * Execute a GraphQL query or mutation against the Shopify Storefront API.
 *
 * Server-only — this module cannot be imported from client components.
 *
 * @param query  - A GraphQL DocumentNode (use gql`` tagged template)
 * @param variables - Optional variables for the query/mutation
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
  if (isMutation(query)) {
    const result = await client.mutate<TData>({
      mutation: query,
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
