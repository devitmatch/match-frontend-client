const initialState = [];

const reducer = (state = initialState, action) => {
  let newProducts;
  let currentProduct;

  switch (action.type) {
    case '@clientCart/ADD_PRODUCTS':
      newProducts = [...state];

      action.products.forEach((p) => {
        currentProduct = state.findIndex(
          (product) =>
            parseInt(product.product_id, 10) === parseInt(p.product_id, 10) &&
            product.client === p.client
        );
        if (currentProduct < 0) {
          newProducts.push(p);
        }
      });
      return [...newProducts];

    case '@clientCart/REMOVE_PRODUCT':
      newProducts = [...state];
      newProducts = newProducts.filter(
        (product) =>
          !(
            product.product_id === action.id && product.client === action.client
          )
      );
      return [...newProducts];

    case '@clientCart/UPDATE_PRODUCT':
      newProducts = [...state];
      currentProduct = state.findIndex(
        (product) =>
          parseInt(product.product_id, 10) ===
          parseInt(action.product.product_id, 10)
      );
      newProducts[currentProduct] = {
        ...action.product,
      };
      return [...newProducts];

    case '@clientCart/CLEAR_CART':
      newProducts = [...state];
      newProducts = newProducts.filter(
        (product) => product.client !== action.client
      );
      return [...newProducts];
    default:
      return state;
  }
};

export default reducer;
