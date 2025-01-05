import React, { useState, useEffect } from "react";

function Login () {
  return (
    <main>
      <section class="m-auto text-center d-flex justify-content-space-between flex-column p-3 mt-5 login-form-section">
        <a href="index.html" title="Home" class="p-2 mt-3 nav-item home-link">Home</a>
        <h1 class="p-2">Login to Pebbles here:</h1>
        <form action="/profile" class="p-2 login-form">
          <span class="p-2 message-cont"></span>
          <div class="p-2 email-input-div"> 
            <div class="p-2 email-feedback-container"></div>
            <input type="email" placeholder="Your email here*" id="email-input" name="email-input" class="p-3 text-center email-input" ></input>
          </div>
          <div class="p-2 password-input-div">
            <div class="p-2 password-feedback-container"></div>
            <input type="password" placeholder="Your password here*" id="password-input" name="password-input" class="p-3 text-center password-input"></input>
          </div>
          <div class="p-2 button-div"> 
            <button type="submit" class="p-2 btn btn-danger submit-button-class" id="submit-button">Login</button>
          </div>
          <div class=""> 
            <div class="p-2 already-account-container">Don't have an account? <a href="signup.html" title="Sign Up to Pebbles">Sign up here</a></div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;