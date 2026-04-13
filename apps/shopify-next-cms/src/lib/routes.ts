export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  COLLECTIONS: '/collections',
} as const;

export function getProductPath(handle: string) {
  return `${ROUTES.PRODUCTS}/${handle}`;
}

export function getCollectionPath(handle: string) {
  return `${ROUTES.COLLECTIONS}/${handle}`;
}
