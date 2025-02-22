import React from "react";
import { NavLink } from "react-router-dom";
import { profileLoginUsage } from "../constants/context.jsx";

function Navbar() {

  const { loggedInState, logout } = profileLoginUsage();

  return (
    <nav className="navbar w-full lg:mt-2 md:mt-0">
      {!loggedInState ? (
        <ul className="text-rose-900 flex flex-row justify-between gap-2 w-full items-center m-auto flex-wrap min-h-[4.5rem] md:flex-wrap min-h-[3rem] s:min-h-[2rem]">
          <li className="m-auto">
            <NavLink to="/" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Home
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/signup" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Sign Up
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/login" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Login
            </NavLink>
          </li>
        </ul>
        ) : (
        <ul className="text-rose-900 flex flex-row justify-between gap-2 w-full items-center m-auto md:min-h-[5.1rem] flex-wrap">
          <li className="m-auto">
            <NavLink to="/venues" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Venues
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/bookings" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Bookings
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/profile" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Profile
            </NavLink>
          </li>
          <li className="m-auto">
            <NavLink to="/hosting" className={({isActive}) => 
            isActive ? "text-black font-bold bg-tertiary rounded-[25px] p-4 border-4 border-secondary lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]" : "text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]"}>
              Hosting
            </NavLink>
          </li>
          <li className="m-auto s:h-[38px]">
            <button onClick={() => logout()} className="h-full w-full text-black font-bold bg-tertiary rounded-[25px] p-4 lg:p-2 font-semibold lg:rounded-[15px] s:text-[0.7rem] p-0 rounded-[13px]">Log Out</button>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;