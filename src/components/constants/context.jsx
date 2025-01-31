import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileLoginContext = createContext();

export const ProfileLoginProvider = ({ children }) => {
  const [loggedInState, setLoggedInState] = useState(!!localStorage.getItem("loggedIn"));
  const [avatarUrlState, setAvatarUrlState] = useState(null);
  const [bioState, setBioState] = useState(null);
  const [venueManagerState, setVenueManagerState] = useState(false);
  const [singleVenue, setSingleVenue] = useState(null);
  const [venueManagerFeedback, setVenueManagerFeedback] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [createVenueState, setCreateVenueState] = useState(false);
  const [bookingsByVenue, setBookingsByVenue] = useState(false);
  const [contextError, setContextError] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [bookingFeedback, setBookingFeedback] = useState(false);

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
    localStorage.setItem("loggedIn", true);
    setLoggedInState(true);
    navigate("/venues");
  }

  const logout = () => {
    localStorage.clear();
    setLoggedInState(false);
    setAvatarUrlState(null);
    setBioState(null);
    setVenueManagerState(null);
    setBookingFeedback(null);
    navigate("/");
  }

  const updateManager = () => {
    setUpdateCounter(updateCounter + 1);
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedInState(!!localStorage.getItem("loggedIn"));
    }
    window.addEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ProfileLoginContext.Provider value={{ loggedInState, setLoggedInState, login, logout, avatarUrlState, setAvatarUrlState, bioState, setBioState, venueManagerState, setVenueManagerState, singleVenue, setSingleVenue, venueManagerFeedback, setVenueManagerFeedback, updateCounter, setUpdateCounter, updateManager, createVenueState, setCreateVenueState, bookingsByVenue, setBookingsByVenue, contextError, setContextError, contextLoading, setContextLoading, bookingFeedback, setBookingFeedback }}>
      {children}
    </ProfileLoginContext.Provider>
  );
}

export const profileLoginUsage = () => useContext(ProfileLoginContext);