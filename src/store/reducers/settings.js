const initialState = {
  language: 'pt-br',
  firstOpen: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case '@settings/SET_LANGUAGE':
      return {
        ...state,
        language: action.language,
      };
    case '@settings/SET_FIRST_OPEN':
      return {
        ...state,
        firstOpen: action.firstOpen,
      };
    default:
      return state;
  }
};

export default reducer;
