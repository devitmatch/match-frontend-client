const isLogedIn = () => {
  const accessToken = localStorage.getItem('leatkn');
  const refreshToken = localStorage.getItem('lertkn');
  if (accessToken && refreshToken) {
    return true;
  }
  return false;
};

export default isLogedIn;
