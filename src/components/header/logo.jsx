import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className="w-full h-full">
      <Link to="/" className="w-full h-full"><img src="/holidaze-logo.png" alt="Holidaze logo" className="h-auto lg:mx-auto md:w-[70%] s:w-full xs:w-full" /></Link>
    </div>
  );
}

export default Logo;