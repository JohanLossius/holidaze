import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileLoginContext = createContext();

export const ProfileLoginProvider = ({ children }) => {
  const [loggedInState, setLoggedInState] = useState(!!localStorage.getItem("loggedIn"));
  const [avatarUrlState, setAvatarUrlState] = useState(localStorage.getItem("avatarUrl") || "/blank-profile-picture-png")
  const [bioState, setBioState] = useState(localStorage.getItem("bioLocalStorage") || null )
  const [venueManagerState, setVenueManagerState] = useState(localStorage.getItem("venueManagerLocalStorage") || false )

  const navigate = useNavigate();

  // const signup = ( username, email ) => {
  //   localStorage.setItem("username", username);
  //   localStorage.setItem("email", email);
  //   localStorage.setItem("loggedIn", false);
  //   setLoggedInState(false);
  // };

  const login = ( username, token, avatarUrl ) => {
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("avatarUrl", avatarUrl);
    localStorage.setItem("loggedIn", true);
    setLoggedInState(true);
    navigate("/venues");
  }

  const logout = () => {
    localStorage.clear();
    setLoggedInState(false);
    navigate("/");
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedInState(!!localStorage.getItem("loggedIn"));
    }
    window.addEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ProfileLoginContext.Provider value={{ loggedInState, login, logout, avatarUrlState, setAvatarUrlState, bioState, setBioState, venueManagerState, setVenueManagerState }}>
      {children}
    </ProfileLoginContext.Provider>
  );
}

export const profileLoginUsage = () => useContext(ProfileLoginContext);