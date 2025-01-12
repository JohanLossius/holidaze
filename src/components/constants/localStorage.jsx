// import React, { createContext, useContext, useState } from "react";

// const username = localStorage.getItem("username");
// const accessToken = localStorage.getItem("accessToken");
// const avatarUrl = localStorage.getItem("avatarUrl");
// const loggedIn = localStorage.getItem("loggedIn");

// export { username, accessToken, avatarUrl, loggedIn };

// export const localStorageSetItem = (key, value) => {
//   localStorage.setItem(key, JSON.stringify(value));
// };

// export const localStorageGetItem = (key) => {
//   const value = localStorage.getItem(key);
//   console.log("localStorageGetItem value:", value ? JSON.parse(value) : null);
//   return value ? JSON.parse(value) : null;
// }

// export const localStorageRemoveItem = (key) => {
//   localStorage.removeItem(key);
// }

// export const localStorageClear = () => {
//   localStorage.clear();
// }