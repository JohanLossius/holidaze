import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const urlPath = useLocation();

  return (
    <nav className="navbar w-full">
      {urlPath.pathname === "/" /* && localStorage === "" */ ? (
        <ul className="flex flex-row justify-between items-center w-2/3 m-auto">
          <li className="text-green-600 m-auto bg-secondary">
            <a href="/">Home</a>
          </li>
          <li className="text-green-600 m-auto">
            <a href="/signup">Sign up</a>
          </li>
          <li className="text-green-600 m-auto">
            <a href="/login">Login</a>
          </li>
        </ul>
        ) : (
        <ul className="text-rose-900 flex flex-row justify-between w-[80%] items-center m-auto">
          <li className={urlPath.pathname === "/venues" ? "text-rose-600 m-auto" : "text-green-600 m-auto"}>
            <NavLink to="/venues" className="nav-links">
              Venues
            </NavLink>
          </li>
          <li className={urlPath.pathname === "/bookings" ? "text-rose-600 m-auto" : "text-green-600 m-auto"}>
            <NavLink to="/bookings" className="nav-links">
              Bookings
            </NavLink>
          </li>
          <li className={urlPath.pathname === "/profile" ? "text-rose-600 m-auto" : "text-green-600 m-auto"}>
            <NavLink to="/profile" className="nav-links">
              Profile
            </NavLink>
          </li>
          <li className={urlPath.pathname === "/hosting" ? "text-rose-600 m-auto" : "text-green-600 m-auto"}>
            <NavLink to="/hosting" className="nav-links">
              Hosting
            </NavLink>
          </li>
          <li className="text-green-600 m-auto">
            <button className="logout-button secondary-button">Log Out</button>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;