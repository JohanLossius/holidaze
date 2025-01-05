import React from "react";
import { Link } from "react-router-dom";

// Logo
function Logo() {
  return (
    <div>
      <Link to="/"><img src="/holidaze-logo.png" alt="Holidaze logo" className="holidaze-logo" /></Link>
    </div>
  );
}

export default Logo;