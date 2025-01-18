import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { profileLoginUsage } from "../constants/loginContext.jsx";

function Navbar() {
  const urlPath = useLocation();

  const { loggedInState, login, logout } = profileLoginUsage();

  return (
    <nav className="navbar w-full">
      {!loggedInState ? (
        <ul className="flex flex-row justify-between items-center w-2/3 m-auto">
          <li className="m-auto">
            <NavLink to="/" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Home
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/signup" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Sign Up
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/login" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Login
            </NavLink>
          </li>
        </ul>
        ) : (
        <ul className="text-rose-900 flex flex-row justify-between w-[80%] items-center m-auto">
          <li className="m-auto">
            <NavLink to="/venues" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Venues
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/bookings" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Bookings
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/profile" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Profile
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/hosting" className={({isActive}) => 
            isActive ? "text-secondary font-bold bg-tertiary rounded-[25px] p-4 border-2 border-rose-300" : "text-secondary font-bold bg-tertiary rounded-[25px] p-4"}>
              Hosting
            </NavLink>
          </li>
          <li className="m-auto">
            <button onClick={() => logout() } className="text-secondary font-bold bg-tertiary rounded-[25px] p-4">Log Out</button>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;