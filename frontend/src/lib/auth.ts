export const getAuthToken = (): string | null => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!).token
    : null;
};

export const getUserInfo = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null;
};

export const logout = () => {
  localStorage.removeItem("userInfo");
  // This will trigger a reload and the beforeLoad check will redirect
  window.location.href = "/admin/login";
};