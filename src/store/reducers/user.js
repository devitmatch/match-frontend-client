const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case '@user/REGISTER':
      return {
        ...action.user,
      };
    case '@user/UNREGISTER':
      return {};
    case '@user/UPDATE':
      return {
        ...state.user,
        ...action.user,
      };
    default:
      return state;
  }
};

export default reducer;
