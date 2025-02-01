import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../constants/api.js";
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
  // const [submittedData, setSubmittedData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { loggedInState, setLoggedInState, login, logout } = profileLoginUsage();

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
    // console.log("onSubmit data:", data);
    // setSubmittedData(data);

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

    // console.log("RequestOptions: ", requestOptions);
        
    try {
      const resp = await fetch(loginApi, requestOptions);
      const json = await resp.json();

      // console.log("Response: ", json);

     if (!resp.ok) {
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0]?.message}</div>);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {

        const token = json.data.accessToken;
        const avatarUrl = json.data.avatar.url;
        const username = json.data.name;
  
        // login(username, token, avatarUrl);
        // console.log("Current token in localStorage:", localStorage.getItem("accessToken"));
        // console.log("New token being added:", token);   
        localStorage.setItem("username", username);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("avatarUrl", avatarUrl);
        localStorage.setItem("loggedIn", true);
        setLoggedInState(true);
        
        const redirectToVenueBooking = location.state?.redirectToVenueBooking;

        if(redirectToVenueBooking) {
          navigate(redirectToVenueBooking);
        }

        if (!redirectToVenueBooking) {
          navigate("/venues");
        }

        setFeedback(<div className="flex flex-col justify-center text-center mx-auto min-h-[15vh] text-green-500 font-bold s:font-semibold text-s">
                      <p className="m-2">You were successfully logged in as:</p>
                      <p className="underline break-all">{username}</p>
                      <p className="m-2">Get started here: <Link to="/venues" className="underline">Venues</Link></p>
                    </div>);
        reset();
      }

    } catch (error) {
      console.log("Error: " + error.message);
    }
  }
    
  return (
    <main className="w-full m-auto mb-4">
      <section className="">
        <div className="flex flex-col justify-between text-center p-4 s:p-2">
          <h2 className="text-center font-bold text-3xl p-2">Login</h2>
          {feedback ? <div className="text-center min-h-[10vh] m-auto">{feedback}</div> : <div className="text-center mx-auto my-2 min-h-[3rem]">Fill in the form to log in.</div>}
        </div>
      </section>
      <form className="flex flex-col m-auto justify-between text-center min-h-[27rem] lg:min-h-[20rem]" onSubmit={handleSubmit(onSubmitHandler)}>
        <label htmlFor="email-id">Your email</label>
        <input
          {...register("email")}
          onBlur={() => handleBlur("email")}
          id="email-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px] lg:w-3/5 md:w-4/5 s:w-[90%] xs:w-[95%]"
        />
        <span className="text-red-500">{errors.email?.message}</span>
        <label htmlFor="password-id">Your password</label>
        <input
          {...register("password")}
          onBlur={() => handleBlur("password")}
          id="password-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px] lg:w-3/5 md:w-4/5 s:w-[90%] xs:w-[95%]"
          type="password"
        />
        <span className="text-red-500">{errors.password?.message}</span>
        <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Log In</button>
        <span>Don't have an account? Sign up here: <Link to="/signup" className="underline">Signup</Link></span> 
      </form>
    </main>
  );
};

export default Login;