import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi, apiKey } from "../constants/api.js";
// import { localStorageSetItem } from "../constants/localStorage.jsx";
import { profileLoginUsage } from "../constants/context.jsx";

const schema = yup
  .object({
    email: yup
      .string()
      .email("You must enter the email you registered with.")
      .required("Please enter the email address you registered with."),
    password: yup
      .string()
      .min(8, "Please enter your password, that should be of 8-100 characters.")
      .max(100, "Please enter your password, that should be of 8-100 characters.")
      .typeError("Please enter your password, that should be of 8-100 characters.")
      .required("Please enter your password, that should be of 8-100 characters."),
  })
  .required();

function Login() {
  const [submittedData, setSubmittedData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { loggedInState, login, logout } = profileLoginUsage();

  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    register,
    handleSubmit,
    formState:
      { errors },
      trigger,
      getValues,
      reset,
    } = useForm({
      resolver: yupResolver(schema),
  });

  // Handle console logging, validation with yup and react form hook
  const handleBlur = async (field) => {

    // Trigger validation for the specified field when it loses focus
    const result = await trigger(field);

    if (result) {
      // Get the current values of the form fields
      const values = getValues();
      
      if (
        !errors.email && !errors.password &&
        values.email && values.password
      ) {
        console.log("Validation succeeded, data:", values);
      }
    }
  };

  async function onSubmitHandler(data) {
    console.log("onSubmit data:", data);
    setSubmittedData(data);

    // event.preventDefault();
  
    localStorage.clear();
    setFeedback(null);

    const emailConst = data.email;
    const passwordConst = data.password;

    const emailConstLower = emailConst.toLowerCase();
        
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email: `${emailConstLower}`,
        password: `${passwordConst}`,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    console.log("RequestOptions: ", requestOptions);
        
    try {
      const resp = await fetch(loginApi, requestOptions);
      const json = await resp.json();

      console.log("Response: ", json);

      if (!resp.ok) {
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0].message}</div>);
        throw new Error(json.errors[0].message);
      }

      const token = json.data.accessToken;
      const avatarUrl = json.data.avatar.url;
      const username = json.data.name;

      login(username, token, avatarUrl);

      if (resp.ok) {
        const redirectToVenueBooking = location.state?.redirectToVenueBooking;

        if(redirectToVenueBooking) {
          navigate(redirectToVenueBooking);
        }

        console.log("Console log: Login successful!");
        setFeedback(<div className="flex flex-col justify-center text-center mx-auto h-[10vh] text-green-500 font-bold">
                      <div className="m-2">You were successfully logged in as {username}!</div>
                      <div className="m-2">Get started here: <Link to="/venues" className="underline">Venues</Link></div>
                    </div>);
        reset();
      }

    } catch (error) {
      console.log("Error: " + error.message);
      // setFeedback(<div className="text-red-500 font-bold">{error.message}</div>);
    }
  }
    
  return (
    <main className="h-[85vh] w-full m-auto">
      <section className="feedback-cont">
        <div className="flex flex-col h-[20vh] justify-between text-center p-4">
          <h2 className="text-center font-bold text-3xl p-2 h-[10vh]">Login</h2>
          {feedback ? <div className="text-center h-[10vh] m-auto">{feedback}</div> : <div className="text-center m-auto h-[10vh]">Fill in the form to log in.</div>}
        </div>
      </section>
      <form className="flex flex-col m-auto justify-between text-center h-[55vh]" onSubmit={handleSubmit(onSubmitHandler)}>
        <label htmlFor="email-id">Your email</label>
        <input
          {...register("email")}
          onBlur={() => handleBlur("email")}
          id="email-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
        />
        <span className="text-red-500">{errors.email?.message}</span>
        <label htmlFor="password-id">Your password</label>
        <input
          {...register("password")}
          onBlur={() => handleBlur("password")}
          id="password-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
        />
        <span className="text-red-500">{errors.password?.message}</span>
        <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Log In</button>
        <span>Don't have an account? Sign up here: <Link to="/signup" className="underline">Signup</Link></span> 
      </form>
    </main>
  );
};

export default Login;