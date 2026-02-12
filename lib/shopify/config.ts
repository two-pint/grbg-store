const STOREFRONT_API_VERSION = "2024-01";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Make sure it is defined in .env.local (see .env.example for reference).`
    );
  }
  return value;
}

export const storeDomain = requireEnv("SHOPIFY_STORE_DOMAIN");
export const storefrontAccessToken = requireEnv(
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN"
);
export const storefrontApiUrl = `https://${storeDomain}/api/${STOREFRONT_API_VERSION}/graphql.json`;
