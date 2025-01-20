import React from "react";
import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./components/frontPage/home.jsx";
import Signup from "./components/signup/signup.jsx";
import Login from "./components/login/login.jsx";
import Venues from "./components/venues/venues.jsx";
import Venue from "./components/venues/venue.jsx";
import Bookings from "./components/booking/bookings.jsx";
import Profile from "./components/profile/profile.jsx";
import Hosting from "./components/hosting/hosting.jsx";
import RouteNotFound from "./components/validation/routeNotFound.jsx";
import { ProfileLoginProvider } from "./components/constants/context.jsx";

// The <Outlet> from react-router-dom displays any child routes, almost like
// passing through "children" in a component
function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} path="/" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Login />} path="/login" />
          <Route element={<Venues />} path="/venues" />
          <Route element={<Venue />} path="/venue/:id" />
          <Route element={<Bookings />} path="/bookings" />
          <Route element={<Profile />} path="/profile" />
          <Route element={<Hosting />} path="/hosting" />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </div>
  )
}


export default App;
