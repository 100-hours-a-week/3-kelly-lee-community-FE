export async function api(url, options = {}) {
  console.log(url);
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("accessToken");
  if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;
  
  const mergedOptions = {
    headers: { ...defaultHeaders},
    ...options,
  };

  const response = await fetch(url, mergedOptions);
  return response;
}