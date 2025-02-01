import React from "react";
import Logo from "./logo";
import Navbar from "./navbar";

function Header() {

  return (
    <header className="flex flex-row m-auto items-center lg:flex-col">
      <div className="w-1/3 min-h-[5.5rem] lg:w-full xs:min-h-[2.8rem]">
        <Logo />
      </div>
      <div className="w-2/3 lg:w-full">
        <Navbar />
      </div>
    </header>
  )
}

export default Header;