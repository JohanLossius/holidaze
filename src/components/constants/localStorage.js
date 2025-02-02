// Exported as a function so they can be called dynamically and avoid stale data

export const getUsername = () => localStorage.getItem("username");

export const getToken = () => localStorage.getItem("accessToken");