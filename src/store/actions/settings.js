export function setLanguage(language) {
  return {
    type: '@settings/SET_LANGUAGE',
    language,
  };
}

export function setFirstOpen(firstOpen) {
  return {
    type: '@settings/SET_FIRST_OPEN',
    firstOpen,
  };
}

export default setLanguage;
