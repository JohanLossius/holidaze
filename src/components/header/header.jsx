import React from "react";
import Logo from "./logo";
import Navbar from "./navbar";

function Header() {

  return (
    <header className="flex flex-row m-auto items-center">
      <div className="w-1/3">
        <Logo />
      </div>
      <div className="w-2/3">
        <Navbar />
      </div>
    </header>
  )
}

export default Header;