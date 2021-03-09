export function addProductsOnClientCart(products) {
  return {
    type: '@clientCart/ADD_PRODUCTS',
    products,
  };
}
export function removeProductOnClientCart(id, client) {
  return {
    type: '@clientCart/REMOVE_PRODUCT',
    id,
    client,
  };
}

export function updateProductOnClientCart(product, client) {
  return {
    type: '@clientCart/UPDATE_PRODUCT',
    product,
    client,
  };
}

export function clearClientCart(client) {
  return {
    type: '@clientCart/CLEAR_CART',
    client,
  };
}
