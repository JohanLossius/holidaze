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
    .boolean()
    .required("Please mark whether you would like to be a Venue Manager."),
})
.required();

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
    register: registerAvatar,
    handleSubmit: handleSubmitAvatar,
    formState: { errors: avatarErrors },
    trigger: triggerAvatar,
    getValues: getValuesAvatar,
    reset: resetAvatar,
    } = useForm({
      resolver: yupResolver(schemaAvatar),
  });

  const {
    register: registerBio,
    handleSubmit: handleSubmitBio,
    formState: { errors: bioErrors },
    trigger: triggerBio,
    getValues: getValuesBio,
    reset: resetBio,
    } = useForm({
      resolver: yupResolver(schemaBio),
  });

  const {
    register: registerVenueManager,
    handleSubmit: handleSubmitVenueManager,
    formState: { errors: venueManagerErrors },
    trigger: triggerVenueManager,
    getValues: getValuesVenueManager,
    reset: resetVenueManager,
    } = useForm({
      resolver: yupResolver(schemaVenueManager),
  });

  // Handle console logging, validation with yup and react form hook
  const handleBlurAvatar = async (field) => {
    // Trigger validation for the specified field when it loses focus
    const result = await triggerAvatar(field);
    console.log("result avatar: ", result);
    if (result) {
      // Get the current values of the form fields
      const values = getValuesAvatar();
      if (
        !avatarErrors.avatar && values.avatar
        // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
      ) {
        console.log("Avatar validation succeeded, data:", values);
      }
    }
  };

    // Handle console logging, validation with yup and react form hook
    const handleBlurBio = async (field) => {
      // Trigger validation for the specified field when it loses focus
      const result = await triggerBio(field);
      console.log("result bio: ", result);
      if (result) {
        // Get the current values of the form fields
        const values = getValuesBio();
        if (
          !bioErrors.bio && values.bio
          // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
        ) {
          console.log("Bio validation succeeded, data:", values);
        }
      }
    };

      // Handle console logging, validation with yup and react form hook
  const handleBlurVenueManager = async (field) => {
    // Trigger validation for the specified field when it loses focus
    const result = await triggerVenueManager(field);
    console.log("result venue manager: ", result);
    if (result) {
      // Get the current values of the form fields
      const values = getValuesVenueManager();
      if (
        !venueManagerErrors.venueManager && values.venueManager
        // !errors.avatar && !errors.bio && !errors.venueManager && values.avatar && values.bio && values.venueManager
      ) {
        console.log("Venue manager validation succeeded, data:", values);
      }
    }
  };

  // avatarhandler form

  async function onSubmitHandlerAvatar(data) {
    console.log("avatar onSubmit data:", data);
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
        setFeedback("Your avatar was successfully updated!")
        setProfileErrorMessage(null);

        resetAvatar();
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

    const requestBioUpdate = {
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

    console.log("requestAvatarUpdate: ", requestBioUpdate);
        
    try {
      const resp = await fetch(singleProfileApi, requestBioUpdate);
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

        console.log("Console log: Bio update successful!");
        setFeedback("Your bio was successfully updated!")
        setProfileErrorMessage(null);

        resetBio();
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

    const requestVenueManagerUpdate = {
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

    console.log("requestVenueManagerUpdate: ", requestVenueManagerUpdate);
        
    try {
      const resp = await fetch(singleProfileApi, requestVenueManagerUpdate);
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

        console.log("Console log: venue manager state update successful!");
        setFeedback("Venue Manager state updated!")
        setProfileErrorMessage(null);

        resetVenueManager();
      }

    } catch (error) {
      console.log("Error: " + error.message);
      // setProfileErrorMessage(error.message); // duplicate
      // setFeedback(null); // duplicate
    }
  }

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
          setVenueManagerState(profileCont.venueManager);
          setAvatarUrlState(profileCont.avatar.url);
          setBioState(profileCont.bio);
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
        <p className="mx-auto mt-auto mb-2">An error has occured. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{errorMessage}</p>
      </main>
    )
  }

  return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 className="mx-auto font-bold text-3xl">Profile test</h1>
      { feedback ? <section className="mx-auto text-green-500 font-bold text-center">{feedback}</section> : null }
      { profileErrorMessage ? <section className="mx-auto font-red-500 font-bold text-center">There was an error updating your profile: {profileErrorMessage}</section> : null }
        { profile ? (
          <section className="flex flex-col mx-auto justify-center justify-between m-4 gap-4">
            {/* <img className="max-h-[25rem] max-w-[50rem] h-auto w-auto" src={profile.banner.url} alt={profile.banner?.alt || "Profile banner"}></img> */}
            <img className="max-h-[8rem] max-w-[8rem] mx-auto h-auto w-auto" src={avatarUrlState || "/blank-profile-picture.png"} alt="Profile picture"></img>
            <h2 className="text-2xl font-bold mx-auto">{profile.name}</h2>
            <h3>{profile.email}</h3>
            <p>Bio: {bioState}</p>
            <form className="flex flex-row items-center m-auto justify-between text-center w-full" onSubmit={handleSubmitAvatar(onSubmitHandlerAvatar)}>
              <label htmlFor="avatar-id">Update profile picture:</label>
              <input
                {...registerAvatar("avatar")}
                onBlur={() => handleBlurAvatar("avatar")}
                id="avatar-id"
                className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
              />
              <span className="text-red-500">{avatarErrors.avatar?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Avatar</button>
            </form>
            <form className="flex flex-row items-center m-auto justify-between text-center w-full" onSubmit={handleSubmitBio(onSubmitHandlerBio)}>
              <label htmlFor="bio-id">Update bio:</label>
              <input
                {...registerBio("bio")}
                onBlur={() => handleBlurBio("bio")}
                id="bio-id"
                className="text-center bg-tertiary w-1/2 mx-auto rounded-[25px]"
              />
              <span className="text-red-500">{bioErrors.bio?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Bio</button>
            </form>
            <form className="flex flex-row items-center m-auto justify-between text-center w-full" onSubmit={handleSubmitVenueManager(onSubmitHandlerVenueManager)}>
              <label htmlFor="venueManager-id">Register as Venue Manager:</label>
              <input
                type="checkbox"
                {...registerVenueManager("venueManager")}
                onBlur={() => handleBlurVenueManager("venueManager")}
                id="venueManager-id"
                className="border-none rounded max-w-[5rem] max-h-[5rem] h-[3.5rem] w-[3.5rem] text-black bg-tertiary p-2 m-auto"
                defaultChecked={venueManagerState}
              />
              <span className="text-red-500">{venueManagerErrors.venueManager?.message}</span>
              <button type="submit" className="bg-primary text-white font-bold p-4 rounded-[25px] w-32 mx-auto">Update Venue Manager state</button>
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