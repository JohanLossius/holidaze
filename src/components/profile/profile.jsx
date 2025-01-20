import React, { useState, useEffect } from "react";
import { profilesApi, apiKey, optionsApiKey } from "../constants/api";
import { maxTwoDecimals } from "../constants/handlers";
import { Link } from "react-router-dom";
import { usernameConst, token, avatarUrlConst } from "../constants/localStorage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { set, useForm } from "react-hook-form";
import { profileLoginUsage } from "../constants/context.jsx";

const schemaAvatar = yup
  .object({
    avatar: yup
      .string()
      .url("Must be a valid URL to a live and publicly accessible image.")
      .required("Please enter a URL to a live, publicly accessible image."),
  })
  .required();

const schemaBio = yup
.object({
  bio: yup
    .string()
    .min(0, "Your bio must be text based and max 250 characters.")
    .max(250, "Your bio can maxiumum be 250 characters.")
    .typeError("Please enter your bio in regular text format.")
    .required("Please enter your bio of max 250 characters."),
})
.required();

const schemaVenueManager = yup
.object({
  venueManager: yup
    .boolean().nullable()
    .required("Please mark whether you would like to be a Venue Manager."),
})
.required();

// const schema = yup
//   .object({
//     email: yup
//       .string()
//       .email("You must enter the email you registered with.")
//       .required("Please enter the email address you registered with."),
//     password: yup
//       .string()
//       .min(8, "Please enter your password, that should be of 8-100 characters.")
//       .max(100, "Please enter your password, that should be of 8-100 characters.")
//       .typeError("Please enter your password, that should be of 8-100 characters.")
//       .required("Please enter your password, that should be of 8-100 characters."),
//   })
//   .required();

function Profile() {

  const { avatarUrlState, setAvatarUrlState, bioState, setBioState, venueManagerState, setVenueManagerState } = profileLoginUsage();

  const [submittedData, setSubmittedData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const singleProfileApi = `${profilesApi}/${usernameConst}`;

  const {
    register,
    handleSubmit,
    formState:
      { errors },
      trigger,
      getValues,
      reset,
    } = useForm({
      resolver: yupResolver(schemaAvatar, schemaBio, schemaVenueManager),
  });

  // Handle console logging, validation with yup and react form hook
  const handleBlur = async (field) => {

    // Trigger validation for the specified field when it loses focus
    const result = await trigger(field);

    console.log("result: ", result);

    if (result) {
      // Get the current values of the form fields
      const values = getValues();
      
      if (
        !errors.avatar && values.avatar
        // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
      ) {
        console.log("Validation succeeded, data:", values);
      }
    }
  };

  // avatarhandler form

  async function onSubmitHandlerAvatar(data) {
    console.log("onSubmit data:", data);
    setSubmittedData(data);

    // setFeedback(null);

    const avatarUrlInput = data.avatar;

    const requestAvatarUpdate = {
      method: "PUT",
      body: JSON.stringify({
        avatar: {
          url: avatarUrlInput,
        },
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };

    console.log("requestAvatarUpdate: ", requestAvatarUpdate);
        
    try {
      const resp = await fetch(singleProfileApi, requestAvatarUpdate);
      const json = await resp.json();

      console.log("Response: ", json);

      if (!resp.ok) {
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const avatarUrl = json.data.avatar.url;

        setAvatarUrlState(avatarUrl);
        localStorage.setItem("avatar", avatarUrl);

        console.log("Console log: avatar update successful!");
        setFeedback("Your profile was successfully updated!")
        setProfileErrorMessage(null);

        reset();
      }

    } catch (error) {
      console.log("Error: " + error.message);
      // setProfileErrorMessage(error.message); // duplicate
      // setFeedback(null); // duplicate
    }
  }

  // onsubmithandlerbio form

  async function onSubmitHandlerBio(data) {
    console.log("onSubmit data:", data);
    setSubmittedData(data);

    // setFeedback(null);

    const bioInput = data.bio;

    const requestAvatarUpdate = {
      method: "PUT",
      body: JSON.stringify({
        bio: bioInput,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };

    console.log("requestAvatarUpdate: ", requestAvatarUpdate);
        
    try {
      const resp = await fetch(singleProfileApi, requestAvatarUpdate);
      const json = await resp.json();

      console.log("Response: ", json);

      if (!resp.ok) {
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const bioConst = json.data.bio;
        setBioState(bioConst);

        console.log("Console log: avatar update successful!");
        setFeedback("Your profile was successfully updated!")
        setProfileErrorMessage(null);

        reset();
      }

    } catch (error) {
      console.log("Error: " + error.message);
      // setProfileErrorMessage(error.message); // duplicate
      // setFeedback(null); // duplicate
    }
  }

  // venuemanager handler form

  async function onSubmitHandlerVenueManager(data) {
    console.log("onSubmit data:", data);
    setSubmittedData(data);

    // setFeedback(null);
    const venueManagerInput = data.venueManager;

    const requestAvatarUpdate = {
      method: "PUT",
      body: JSON.stringify({
        venueManager: venueManagerInput
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      },
    };

    console.log("requestAvatarUpdate: ", requestAvatarUpdate);
        
    try {
      const resp = await fetch(singleProfileApi, requestAvatarUpdate);
      const json = await resp.json();

      console.log("Response: ", json);

      if (!resp.ok) {
        setProfileErrorMessage(json.errors[0].message);
        setFeedback(null);
        throw new Error(json.errors[0].message);
      }

      if (resp.ok) {
        const venueManagerConst = json.data.venueManager;

        setVenueManagerState(venueManagerConst);

        console.log("Console log: avatar update successful!");
        setFeedback("Your profile was successfully updated!")
        setProfileErrorMessage(null);

        reset();
      }

    } catch (error) {
      console.log("Error: " + error.message);
      // setProfileErrorMessage(error.message); // duplicate
      // setFeedback(null); // duplicate
    }
  }


  // async function onSubmitHandler(data) {
  //   console.log("onSubmit data:", data);
  //   setSubmittedData(data);

  //   // setFeedback(null);

  //   const avatarUrlInput = data.avatar;
  //   const bioInput = data.bio;
  //   const venueManagerInput = data.venueManager;

  //   const requestAvatarUpdate = {
  //     method: "PUT",
  //     body: JSON.stringify({
  //       avatar: {
  //         url: avatarUrlInput,
  //       },
  //       bio: bioInput,
  //       venueManager: venueManagerInput
  //     }),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8",
  //       "Authorization": `Bearer ${token}`,
  //       "X-Noroff-API-Key": apiKey
  //     },
  //   };

  //   console.log("requestAvatarUpdate: ", requestAvatarUpdate);
        
  //   try {
  //     const resp = await fetch(singleProfileApi, requestAvatarUpdate);
  //     const json = await resp.json();

  //     console.log("Response: ", json);

  //     if (!resp.ok) {
  //       setProfileErrorMessage(json.errors[0].message);
  //       setFeedback(null);
  //       throw new Error(json.errors[0].message);
  //     }

  //     if (resp.ok) {
  //       const avatarUrl = json.data.avatar.url;
  //       const bioConst = json.data.bio;
  //       const venueManagerConst = json.data.venueManager;

  //       setAvatarUrlState(avatarUrl);
  //       localStorage.setItem("avatar", avatarUrl);

  //       setBioState(bioConst);
  //       setVenueManagerState(venueManagerConst);

  //       console.log("Console log: avatar update successful!");
  //       setFeedback("Your profile was successfully updated!")
  //       setProfileErrorMessage(null);

  //       reset();
  //     }

  //   } catch (error) {
  //     console.log("Error: " + error.message);
  //     // setProfileErrorMessage(error.message); // duplicate
  //     // setFeedback(null); // duplicate
  //   }
  // }

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetch(singleProfileApi, optionsApiKey);
        const jsonObject = await response.json();
        console.log("jsonObject: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const profileCont = jsonObject.data;
        console.log("profileCont ", profileCont);

        if (!response.ok) {
          throw new Error(jsonObject.errors[0]?.message || "An unknown error occured.");
        }
        if (response.ok) {
          setProfile(profileCont);
        }
      } catch (error) {
        console.log("Error: " + error.message);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  if (loading) {
    return (
      <main className="h-auto min-h-[85vh] text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Profile</h1>
        <section className="m-auto">Your profile is loading...</section>
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className="h-auto min-h-[85vh] text-center w-full m-auto flex flex-col">
        <p className="mx-auto mt-auto mb-2">I'm sorry, darling, but an error has occured. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{errorMessage}</p>
      </main>
    )
  }

  return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 className="mx-auto font-bold text-3xl">Profile</h1>
      { feedback ? <section className="mx-auto text-green-500 font-bold text-center">{feedback}</section> : null }
      { profileErrorMessage ? <section className="mx-auto font-red-500 font-bold text-center">There was an error updating your profile: {profileErrorMessage}</section> : null }
        { profile ? (
          <section className="flex flex-col mx-auto justify-center justify-between m-4 gap-4">
            {/* <img className="max-h-[25rem] max-w-[50rem] h-auto w-auto" src={profile.banner.url} alt={profile.banner?.alt || "Profile banner"}></img> */}
            <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={avatarUrlState} alt={profile.avatar?.alt || "Profile picture"}></img>
            <h2 className="text-2xl font-bold mx-auto">{profile.name}</h2>
            <h3>{profile.email}</h3>
            <p>Bio: {bioState}</p>
            <form className="flex flex-row m-auto justify-between text-center w-full" onSubmit={handleSubmit(onSubmitHandlerAvatar)}>
              <label htmlFor="avatar-id">Update profile picture:</label>
              <input
                {...register("avatar")}
                onBlur={() => handleBlur("avatar")}
                id="avatar-id"
                className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
              />
              <span className="text-red-500">{errors.avatar?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Avatar</button>
            </form>
            <form className="flex flex-row m-auto justify-between text-center w-full" onSubmit={handleSubmit(onSubmitHandlerBio)}>
              <label htmlFor="bio-id">Update bio:</label>
              <input
                {...register("bio")}
                onBlur={() => handleBlur("bio")}
                id="bio-id"
                className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
              />
              <span className="text-red-500">{errors.bio?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Avatar</button>
            <form className="flex flex-row m-auto justify-between text-center w-full" onSubmit={handleSubmit(onSubmitHandlerVenueManager)}>
            </form>
              <label htmlFor="venueManager-id">Register as Venue Manager:</label>
              <input
                type="checkbox"
                {...register("venueManager")}
                onBlur={() => handleBlur("venueManager")}
                id="venueManager-id"
                className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
              />
              <span className="text-red-500">{errors.venueManager?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Avatar</button>
            </form>
            <p>Bookings: {profile._count.bookings}</p>
            <div>
              <span>{venueManagerState === true ? "Venue Manager: Yes" : "Venue Manager: No"}</span>
            </div>
            <p>Venues under management: {profile._count.venues}</p>
          </section>
        ) : (
          <section className="flex flex-wrap justify-center justify-between m-4 gap-4"> 
            <div>No profile data was found. Please ensure you are logged in: <Link className="underline" to="/login">Log in</Link></div>
          </section>
        )}
        <div>
          <img src=""></img>
        </div>
    </main>
  );
}

export default Profile;