import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { signupApi } from "../constants/api.js";

const schema = yup
  .object({
    firstName: yup
      .string()
      .min(2, "Your first name must be 2 characters or more.")
      .max(99, "Your first name must be less than 100 characters.")
      .typeError("Your first name must be 2-99 characters.")
      .required("Please enter your first name"),
    lastName: yup
      .string()
      .min(2, "Your last name must be 2 characters or more.")
      .max(99, "Your last name must be less than 100 characters.")
      .typeError("Your last name must be 2-99 characters.")
      .required("Please enter your last name"),
    email: yup
      .string()
      .email("You must enter a valid email address.")
      .required("Please enter a valid email address."),
    password: yup
      .string()
      .min(8, "Your password must be 8 characters or more.")
      .max(100, "Your password must be max 100 characters.")
      .typeError("Your password must be 8-100 characters.")
      .required("Please enter a valid password of 8-100 characters."),
  })
  .required();


function Signup() {
  const [feedback, setFeedback] = useState(null);
  
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState:
      { errors },
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
        !errors.firstName && !errors.lastName && !errors.email && !errors.password &&
        values.firstName && values.lastName && values.email && values.password
      ) {
        console.log("Validation succeeded, data:", values);
      }
    }
  };

  /**
  * Handles user signup by sending form data to the API
  * Updates UI feedback based on success or failure
  * @async
  * @param {object} data - takes the data inputted for the signup form
  * @param {string} data.firstName - The user's first name.
  * @param {string} data.lastName - The user's last name.
  * @param {string} data.email - The user's email address.
  * @param {string} data.password - The user's password.
  * @param {object} json Succesful response from the API is returned as an object, and the user data is nested within an object called "data"
  * 
  * @example
  * // example succesful API response
  * {
      "data": {
        "name": "arnulf_friedenstein",
        "email": "arnulf_friedenstein@stud.noroff.no",
        "bio": null,
        "avatar": {
          "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400",
          "alt": "A blurry multi-colored rainbow background"
        },
        "banner": {
          "url": "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500",
          "alt": "A blurry multi-colored rainbow background"
        }
      },
      "meta": {}
    }
  */

  async function onSubmitHandler(data) {

    localStorage.clear();
    setFeedback(null);

    const firstNameConst = data.firstName;
    const lastNameConst = data.lastName;
    const emailConst = data.email;
    const passwordConst = data.password;

    const emailConstLower = emailConst.toLowerCase();

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        name: `${firstNameConst}_${lastNameConst}`,
        email: `${emailConstLower}`,
        password: `${passwordConst}`,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    try {
      const resp = await fetch(signupApi, requestOptions);
      const json = await resp.json();

      if (!resp.ok) {
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0]?.message}</div>);
        throw new Error(json.errors[0].message);
      }

      const username = json.data.name;
      const email = json.data.email;

      if (resp.ok) {
        setFeedback(<div className="flex flex-col justify-center text-center mx-auto min-h-[15vh] text-green-500 font-bold s:font-semibold text-s">
                      <div className="">Your profile was successfully created!</div>
                      <div className="underline break-all">Username: {username}</div>
                      <div className="break-all underline">Email: {email}</div>
                      <div className="">Get started by logging in here: <Link to="/login" className="underline">Login</Link></div>
                    </div>);
        reset();

      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  return (
    <main className="w-full m-auto mb-6">
      <section className="feedback-cont">
        <div className="flex flex-col justify-center text-center p-2">
          <h2 className="text-center font-bold text-3xl p-2">Sign up</h2>
          {feedback ? <div className="text-center m-auto flex flex-col justify-center">{feedback}</div> :
          <div className="flex flex-col justify-center text-center p-4">
            <span className="span-contact text-center m-auto">Fill in the form below to create your profile.</span>
          </div>}
        </div>
      </section>
      <form className="flex flex-col m-auto justify-between text-center min-h-[27rem] lg:min-h-[20rem]" onSubmit={handleSubmit(onSubmitHandler)}>
        <label htmlFor="first-name-id">Your first name</label>
        <input
          {...register("firstName")}
          onBlur={() => handleBlur("firstName")}
          id="first-name-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px] lg:w-3/5 md:w-4/5 s:w-[90%] xs:w-[95%]"
        />
        <span className="text-red-500">{errors.firstName?.message}</span>
        <label htmlFor="last-name-id">Your last name</label>
        <input
          {...register("lastName")}
          onBlur={() => handleBlur("lastName")}
          id="last-name-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px] lg:w-3/5 md:w-4/5 s:w-[90%] xs:w-[95%]"
        />
        <span className="text-red-500">{errors.lastName?.message}</span>
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
          type="password"
          onBlur={() => handleBlur("password")}
          id="password-id"
          className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px] lg:w-3/5 md:w-4/5 s:w-[90%] xs:w-[95%]"
        />
        <span className="text-red-500">{errors.password?.message}</span>
        <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Sign Up</button>
        <span>Already have an account? Log in here: <Link to="/login" className="underline">Login</Link></span> 
      </form>
    </main>
  );
};

export default Signup;